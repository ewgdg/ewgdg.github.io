from functools import singledispatch
import numpy as np
from haystack.document_store.sql import ORMBase, SQLDocumentStore
from sqlalchemy.engine import create_engine
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.pool import SingletonThreadPool
# import time
import os
# from elasticsearch import Elasticsearch
# from subprocess import Popen, PIPE, STDOUT
from haystack.document_store.elasticsearch import ElasticsearchDocumentStore
from haystack.retriever.dense import EmbeddingRetriever
import yaml
from haystack import Finder
from haystack.reader.farm import FARMReader
from haystack.document_store.faiss import FAISSDocumentStore
from haystack.retriever.sparse import TfidfRetriever

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from starlette.middleware.cors import CORSMiddleware

# from subprocess import Popen, PIPE, STDOUT
# es_server = Popen(['elasticsearch-7.9.2/bin/elasticsearch'],
#                   stdout=PIPE, stderr=STDOUT,
#                   preexec_fn=lambda: os.setuid(1)  # as daemon
#                   )


app = FastAPI()
origins = [
    "https://xianzhang.dev",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:8080"
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

modelDir = config["modelDir"]
sqlUrl = config["sqlUrl"]
sqlUrlFAQ = config["sqlUrlFAQ"]

# prediction = finder2.get_answers_via_similar_questions(
#     question="How is the virus spreading?", top_k_retriever=1)

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


class Chatbot:
    def __init__(self):
        self.document_store = None
        self.retriever = None
        self.reader = None
        self.finder = None

        self.document_store2 = None
        self.retriever2 = None
        self.finder2 = None

    def initSql(self, url, document_store):
        document_store.session.close()
        engine = create_engine(url,
                               poolclass=SingletonThreadPool, connect_args={"check_same_thread": False})
        ORMBase.metadata.create_all(engine)
        Session = sessionmaker(bind=engine)
        document_store.session = Session()

    def load(self):
        if(self.finder and self.finder2):
            return
        if(not self.document_store2):
            self.document_store2 = FAISSDocumentStore.load(
                sql_url=sqlUrlFAQ, faiss_file_path='faiss2')  # save before load in preprocess
            self.initSql(url=sqlUrlFAQ, document_store=self.document_store2)
        # else:  # reset session
        #     # self.document_store2.session.close()
        #     super(
        #         FAISSDocumentStore, self.document_store2).__init__(url=sqlUrlFAQ)
        if(not self.retriever2):
            self.retriever2 = EmbeddingRetriever(document_store=self.document_store2,
                                                 embedding_model="sentence_bert-saved", use_gpu=False)
        if(not self.finder2):
            self.finder2 = Finder(reader=None, retriever=self.retriever2)

        if(not self.document_store):
            self.document_store = SQLDocumentStore(url=sqlUrl)  
            #FAISSDocumentStore.load(faiss_file_path='faiss1', sql_url=sqlUrl)
                                                          
            self.initSql(url=sqlUrl, document_store=self.document_store)
        # else:  # reset session
        #     # self.document_store.session.close()
        #     super(
        #         FAISSDocumentStore, self.document_store).__init__(url=sqlUrl)
        # self.retriever = EmbeddingRetriever( #redice load by sharing the same retriever and set store on fly??
        #     document_store=self.document_store, embedding_model="sentence_bert-saved", use_gpu=False) if not self.retriever else self.retriever
        if(not self.retriever):
            self.retriever = TfidfRetriever(document_store=self.document_store)
        self.reader = FARMReader(model_name_or_path=modelDir,
                                 use_gpu=False, no_ans_boost=0) if not self.reader else self.reader
        # reader = TransformersReader(model_name_or_path="distilbert-base-uncased-distilled-squad", tokenizer="distilbert-base-uncased", use_gpu=-1)
        self.finder = Finder(
            self.reader, self.retriever) if not self.finder else self.finder

    def getfinder1(self):
        # self.retriever.document_store = self.document_store
        return self.finder

    def getfinder2(self):
        # self.retriever2.document_store = self.document_store2
        return self.finder2

    def endSessions(self):
        self.document_store2.session.close()
        self.document_store.session.close()

    def get_answers_via_similar_questions(self, question, finder=None, top_k_retriever=1, filters=None, index=None):
        if(not finder):
            finder = self.finder2

        if finder.retriever is None:
            raise AttributeError(
                "Finder.get_answers_via_similar_questions requires self.retriever")

        results = {"question": question, "answers": []}  # type: Dict[str, Any]

        # 1) Apply retriever to match similar questions via cosine similarity of embeddings
        documents = finder.retriever.retrieve(
            question, top_k=top_k_retriever, filters=filters, index=index)

        # 2) Format response
        for doc in documents:
            # TODO proper calibratation of pseudo probabilities
            cur_answer = {
                # "question": doc.text,
                "answer": doc.meta["answer"],
                # "document_id": doc.id,
                # "context": doc.text,
                # "score": doc.score,
                "probability": doc.probability/100,
                # "offset_start": 0,
                # "offset_end": len(doc.text),
                # "meta": doc.meta
            }

            results["answers"].append(cur_answer)

        return results


chatbot = Chatbot()


@app.get("/hi")
def hi():
    try:
        chatbot.load()
        return {"status": "ok"}
    except:
        return {"status": "error"}


@app.get("/qa/{question}")
def qa(question: str):
    # if not chatbot.finder:
    chatbot.load()
    ret = [{"results": {"answers": []}}]
    results2 = chatbot.get_answers_via_similar_questions(
        question=question, finder=chatbot.getfinder2(), top_k_retriever=1)
    if(len(results2["answers"]) > 0 and results2["answers"][0]["probability"] >= 0.8):
        ret = {"results": results2}
    else:
        results = chatbot.getfinder1().get_answers(
            question=question, top_k_retriever=2, top_k_reader=2)
        ret = {"results": {
            "answers": results2["answers"]+results["answers"]}}
        # ret = {"results": results}
    # chatbot.endSessions()
    # print(ret)
    ans=[]
    for item in ret["results"]["answers"]:
        ans.append({"answer": item["answer"], "probability": item["probability"]})
    # print(ans)
    return {"results": {"answers": ans}}


if __name__ == "__main__":
    uvicorn.run("main:app", int(os.environ.get('PORT', 8080)))
