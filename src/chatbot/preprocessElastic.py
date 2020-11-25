from elasticsearch import Elasticsearch
from farm.data_handler.processor import Processor
from farm.modeling.adaptive_model import AdaptiveModel
import pandas as pd
from haystack.utils import print_answers
from haystack.retriever.dense import EmbeddingRetriever
from haystack.document_store.elasticsearch import ElasticsearchDocumentStore
import os
from subprocess import Popen, PIPE, STDOUT
import time

es_server = Popen(['elasticsearch-7.9.2/bin/elasticsearch'],
                  stdout=PIPE, stderr=STDOUT,
                  preexec_fn=lambda: os.setuid(1)  # as daemon
                  )


done = False
client = Elasticsearch(timeout=1000) # (hosts=[{"host": "localhost", "port": 9200}], http_auth=("", ""),scheme="http", ca_certs=False, verify_certs=True)
while not done:
    try:                                   
        client.info()
        done = True
    except:
        # print('error')
        time.sleep(2)
        pass


# wait for server to load
# es_server.stdout.read()

document_store = ElasticsearchDocumentStore(host="localhost", username="", password="",
                                            index="document",
                                            embedding_field="question_emb",
                                            embedding_dim=768,
                                            excluded_meta_data=["question_emb"])

# download and save the model

model = AdaptiveModel.convert_from_transformers(
    "deepset/sentence_bert", device="cpu", task_type="embeddings")
processor = Processor.convert_from_transformers(
    "deepset/sentence_bert", task_type="embeddings", max_seq_len=384, doc_stride=128)
model.save("sentence_bert-saved")
processor.save("sentence_bert-saved")

# retriever2 = EmbeddingRetriever(
#     document_store=document_store, embedding_model="deepset/sentence_bert", use_gpu=False) distilbert-base-uncased
retriever2 = EmbeddingRetriever(
    document_store=document_store, embedding_model="sentence_bert-saved", use_gpu=False)


# Get dataframe with columns "question", "answer" and some custom metadata
df = pd.read_csv("faq.csv")
# Minimal cleaning
df.fillna(value="", inplace=True)
df["question"] = df["question"].apply(lambda x: x.strip())
print(df.head())

# Get embeddings for our questions from the FAQs
questions = list(df["question"].values)
df["question_emb"] = retriever2.embed_queries(texts=questions)
df = df.rename(columns={"answer": "text"})

# Convert Dataframe to list of dicts and index them in our DocumentStore
docs_to_index = df.to_dict(orient="records")
document_store.write_documents(docs_to_index)
