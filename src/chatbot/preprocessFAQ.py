from haystack.document_store.faiss import FAISSDocumentStore
from elasticsearch import Elasticsearch
from farm.data_handler.processor import Processor
from farm.modeling.adaptive_model import AdaptiveModel
import pandas as pd
from haystack.utils import print_answers
from haystack.retriever.dense import EmbeddingRetriever
from haystack.document_store.elasticsearch import ElasticsearchDocumentStore

import os
import shutil
# get documents that we want to query
dirname = os.path.dirname(__file__)

configFile = os.path.join(dirname,'config.yaml')

import yaml

config = None
with open(configFile) as file:
  config = yaml.safe_load(file)

sqlUrlFAQ = config["sqlUrlFAQ"]


model = AdaptiveModel.convert_from_transformers(
    "deepset/sentence_bert", device="cpu", task_type="embeddings")
processor = Processor.convert_from_transformers(
    "deepset/sentence_bert", task_type="embeddings", max_seq_len=384, doc_stride=128)
model.save("sentence_bert-saved")
processor.save("sentence_bert-saved")


document_store = FAISSDocumentStore(sql_url=sqlUrlFAQ)


# from haystack.retriever.dense import DensePassageRetriever
# retriever = DensePassageRetriever(document_store=document_store,
#                                   query_embedding_model="facebook/dpr-question_encoder-single-nq-base",
#                                   passage_embedding_model="facebook/dpr-ctx_encoder-single-nq-base",
#                                   max_seq_len_query=64,
#                                   max_seq_len_passage=256,
#                                   batch_size=16,
#                                   use_gpu=True,
#                                   embed_title=True,
#                                   use_fast_tokenizers=True)


# Get dataframe with columns "question", "answer" and some custom metadata
df = pd.read_csv("faq.csv")
# Minimal cleaning
df.fillna(value="", inplace=True)
df["question"] = df["question"].apply(lambda x: x.strip())
print(df.head())

# Get embeddings for our questions from the FAQs
# questions = list(df["question"].values)
# df["question_emb"] = retriever2.embed_queries(texts=questions)
# text is the field to be converted to embeddings
df = df.rename(columns={"question": "text"})

# Convert Dataframe to list of dicts and index them in our DocumentStore
docs_to_index = df.to_dict(orient="records")
document_store.delete_all_documents()
document_store.write_documents(docs_to_index)


retriever2 = EmbeddingRetriever(
    document_store=document_store, embedding_model="sentence_bert-saved", use_gpu=False)
document_store.update_embeddings(retriever2)
document_store.save('faiss2')