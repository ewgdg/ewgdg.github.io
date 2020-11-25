import os
from elasticsearch import Elasticsearch
from subprocess import Popen, PIPE, STDOUT
from haystack.document_store.elasticsearch import ElasticsearchDocumentStore
from haystack.retriever.dense import EmbeddingRetriever
import yaml
from haystack import Finder
from haystack.reader.farm import FARMReader
from haystack.document_store.sql import SQLDocumentStore
from haystack.retriever.sparse import TfidfRetriever

# if(prob<0.9) { add first then concat all top sol > 0.6}
import uvicorn
from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware

from subprocess import Popen, PIPE, STDOUT
es_server = Popen(['elasticsearch-7.9.2/bin/elasticsearch'],
                  stdout=PIPE, stderr=STDOUT,
                  preexec_fn=lambda: os.setuid(1)  # as daemon
                  )


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


# prediction = finder2.get_answers_via_similar_questions(
#     question="How is the virus spreading?", top_k_retriever=1)
import time

class Chatbot:
    def __init__(self):
        self.document_store = None
        self.retriever = None
        self.reader = None
        self.finder = None

        self.document_store2 = None
        self.retriever2 = None
        self.finder2 = None

    def waitEsReady(self):
        done = False
        client = Elasticsearch(timeout=1000)
        while not done:
            try:
                client.info()
                done = True
            except:
                time.sleep(2)
                pass

    def load(self):
        chatbot.waitEsReady()
        if(not self.document_store2):
            self.document_store2 = ElasticsearchDocumentStore(host="localhost", username="", password="",
                                                              index="document",
                                                              embedding_field="question_emb",
                                                              embedding_dim=768,
                                                              excluded_meta_data=["question_emb"])
        if(not self.retriever2):
            self.retriever2 = EmbeddingRetriever(document_store=self.document_store2,
                                                 embedding_model="sentence_bert-saved", use_gpu=False)
        if(not self.finder2):
            self.finder2 = Finder(reader=None, retriever=self.retriever2)

        if(self.finder):
            return
        self.document_store = SQLDocumentStore(
            url=sqlUrl) if not self.document_store else self.document_store
        self.retriever = TfidfRetriever(
            document_store=self.document_store) if not self.retriever else self.retriever
        self.reader = FARMReader(model_name_or_path=modelDir,
                                 use_gpu=False, no_ans_boost=0) if not self.reader else self.reader
        # reader = TransformersReader(model_name_or_path="distilbert-base-uncased-distilled-squad", tokenizer="distilbert-base-uncased", use_gpu=-1)
        self.finder = Finder(
            self.reader, self.retriever) if not self.finder else self.finder


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
    if not chatbot.finder:
        chatbot.load()

    results2 = chatbot.finder2.get_answers_via_similar_questions(
        question, top_k_retriever=1)
    if(results2.answers[0].answer.probabilty >= 80):
        return {"results": results2}
    else:
        results = chatbot.finder.get_answers(
            question=question, top_k_retriever=2, top_k_reader=2)
        return {"results": {"answers": results2["answers"]+results["answers"]}}


if __name__ == "__main__":
    uvicorn.run("main:app", int(os.environ.get('PORT', 8080)))
