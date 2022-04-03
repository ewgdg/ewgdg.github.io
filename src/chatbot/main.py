from functools import singledispatch
import numpy as np

# from haystack.document_store.sql import ORMBase, SQLDocumentStore
# from sqlalchemy.engine import create_engine
# from sqlalchemy.orm.session import sessionmaker
# from sqlalchemy.pool import SingletonThreadPool
# import time
import os

import yaml
# from haystack import Finder
from haystack.document_stores import FAISSDocumentStore, SQLDocumentStore
from haystack.nodes import TfidfRetriever, EmbeddingRetriever, FARMReader

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from starlette.middleware.cors import CORSMiddleware

# from subprocess import Popen, PIPE, STDOUT
# es_server = Popen(['elasticsearch-7.9.2/bin/elasticsearch'],
#                   stdout=PIPE, stderr=STDOUT,
#                   preexec_fn=lambda: os.setuid(1)  # as daemon
#                   )

from haystack.pipelines import FAQPipeline, ExtractiveQAPipeline
from pathlib import Path

app = FastAPI()
origins = [
    "https://xianzhang.dev",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
]
allow_origin_regex = '.*\.xianzhang\.dev'
app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   #    allow_origin_regex='.*',
                   allow_credentials=False,
                   allow_methods=["*"],
                   allow_headers=["*"],)


dirname = os.path.dirname(__file__)

configFile = os.path.join(dirname, 'config.yaml')
config = None
with open(configFile) as file:
    config = yaml.safe_load(file)

# modelDir = config["modelDir"]
sqlUrl = config["sqlUrl"]
sqlUrlFAQ = config["sqlUrlFAQ"]


# thread issue for sql :engine=create_engine('sqlite:///data.db', echo=True, connect_args={"check_same_thread": False})
# or need to create new store instance each request
# or# maintain the same connection per thread
# from sqlalchemy.pool import SingletonThreadPool
# engine = create_engine('sqlite:///mydb.db',
#                 poolclass=SingletonThreadPool)


@singledispatch
def to_serializable(val):
    """Used by default."""
    return str(val)


@to_serializable.register(np.float32)
def ts_float32(val):
    """Used if *val* is an instance of numpy.float32."""
    return np.float64(val)


# for curDir, subdirList, fileList in os.walk("."):
#     print('Found directory: %s' % os.path.basename(curDir))
#     for fname in fileList:
#         print('\t%s' % fname)


class Chatbot:
    def __init__(self):
        self.qaStore = None
        self.qaRetriever = None
        self.qaReader = None
        self.qaPipeline = None

        self.faqStore = None
        self.faqRetriever = None
        self.faqPipeline = None

    # def initSql(self, url, document_store):
    #     document_store.session.close()
    #     engine = create_engine(url,
    #                            poolclass=SingletonThreadPool, connect_args={"check_same_thread": False})
    #     ORMBase.metadata.create_all(engine)
    #     Session = sessionmaker(bind=engine)
    #     document_store.session = Session()

    def load(self):
        if(self.faqPipeline and self.qaPipeline):
            return

        if(not self.faqStore):
            self.faqStore = FAISSDocumentStore.load(
                index_path="faq-faiss-index.faiss")
            # self.initSql(url=sqlUrlFAQ, document_store=self.faqStore)
        # else:  # reset session
        #     # self.document_store2.session.close()
        #     super(
        #         FAISSDocumentStore, self.document_store2).__init__(url=sqlUrlFAQ)
        if(not self.faqRetriever):
            self.faqRetriever = EmbeddingRetriever(document_store=self.faqStore,
                                                   embedding_model=Path(
                                                       "./faq-model-saved"),
                                                   model_format="sentence_transformers",
                                                   use_gpu=False)
        if(not self.faqPipeline):
            self.faqPipeline = FAQPipeline(retriever=self.faqRetriever)

        if(not self.qaStore):
            self.qaStore = SQLDocumentStore(url=sqlUrl)
            #FAISSDocumentStore.load(faiss_file_path='faiss1', sql_url=sqlUrl)
            # self.initSql(url=sqlUrl, document_store=self.qaStore)

        if(not self.qaRetriever):
            self.qaRetriever = TfidfRetriever(document_store=self.qaStore)

        if(not self.qaReader):
            self.qaReader = FARMReader(
                model_name_or_path="./qa-model-saved", use_gpu=False)
            # self.reader = FARMReader(model_name_or_path=modelDir,
            #                          use_gpu=False, no_ans_boost=0) if not self.reader else self.reader
            # reader = TransformersReader(model_name_or_path="distilbert-base-uncased-distilled-squad", tokenizer="distilbert-base-uncased", use_gpu=-1)

        # self.finder = Finder(
        #     self.reader, self.qaRetriever) if not self.finder else self.finder
        if(not self.qaPipeline):
            self.qaPipeline = ExtractiveQAPipeline(
                self.qaReader, self.qaRetriever)

    def getQaPipeline(self):
        # self.retriever.document_store = self.document_store
        return self.qaPipeline

    def getFaqPipeline(self):
        # self.retriever2.document_store = self.document_store2
        return self.faqPipeline

    def endSessions(self):
        self.faqStore.session.close()
        self.qaStore.session.close()

    def get_answers_via_similar_questions(self, question, pipe=None, top_k_retriever=1, filters=None, index=None):
        if(not pipe):
            pipe = self.faqPipeline

        if(not question.endswith("?")):
            question = question+"?"

        results = {"question": question, "answers": []}  # type: Dict[str, Any]

        prediction = pipe.run(
            query=question, params={"Retriever": {"top_k": top_k_retriever}})

        # 2) Format response
        for answer in prediction["answers"]:
            # TODO proper calibratation of pseudo probabilities
            cur_answer = {
                # "question": doc.text,
                "answer": answer.answer,
                # "document_id": doc.id,
                # "context": doc.text,
                "probability": answer.score,
                # "meta": doc.meta
            }

            results["answers"].append(cur_answer)
        # print(prediction)
        return results

    def get_answers_via_extractive_qa(self, question, pipe=None, top_k_retriever=2, top_k_reader=4):
        if(not pipe):
            pipe = self.qaPipeline

        if(not (question.endswith("?") or question.endswith("."))):
            question = question+"?"

        results = {"question": question, "answers": []}

        prediction = pipe.run(
            query=question, params={"Retriever": {"top_k": top_k_retriever}, "Reader": {"top_k": top_k_reader}})

        for answer in prediction["answers"]:
            # TODO proper calibratation of pseudo probabilities
            cur_answer = {
                "answer": answer.answer,
                "probability": answer.score,
            }
            results["answers"].append(cur_answer)
        # print(prediction)
        return results


chatbot = Chatbot()
chatbot.load()


@app.get("/hi")
def hi():
    try:
        return {"status": "ok"}
    except:
        return {"status": "error"}


@app.get("/qa/{question}")
def qa(question: str):
    # if not chatbot.finder:
    ret = [{"results": {"answers": []}}]
    faqResult = chatbot.get_answers_via_similar_questions(
        question=question, pipe=chatbot.getFaqPipeline(), top_k_retriever=1)
    if(len(faqResult["answers"]) > 0 and faqResult["answers"][0]["probability"] >= 0.8):
        ret = {"results": faqResult}
    elif chatbot.getQaPipeline() != None:
        qaResults = chatbot.get_answers_via_extractive_qa(
            question=question, pipe=chatbot.getQaPipeline(), top_k_retriever=2, top_k_reader=5)
        ret = {"results": {
            "answers": faqResult["answers"]+qaResults["answers"]}}

    return ret


if __name__ == "__main__":
    uvicorn.run("main:app", int(os.environ.get('PORT', 8080)))
