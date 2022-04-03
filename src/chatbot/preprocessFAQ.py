import yaml
from haystack.document_stores import FAISSDocumentStore
# from elasticsearch import Elasticsearch
# from farm.data_handler.processor import Processor
# from farm.modeling.adaptive_model import AdaptiveModel
import pandas as pd
# from haystack.utils import print_answers
from haystack.nodes import EmbeddingRetriever
# from haystack.document_stores import ElasticsearchDocumentStore
from pathlib import Path
import os
import shutil
# get documents that we want to query
dirname = os.path.dirname(__file__)

configFile = os.path.join(dirname, 'config.yaml')


config = None
with open(configFile) as file:
    config = yaml.safe_load(file)

sqlUrlFAQ = config["sqlUrlFAQ"]


# model = AdaptiveModel.convert_from_transformers(
#     "deepset/sentence_bert", device="cpu", task_type="embeddings")
# processor = Processor.convert_from_transformers(
#     "deepset/sentence_bert", task_type="embeddings", max_seq_len=384, doc_stride=128)
# model.save("sentence_bert-saved")
# processor.save("sentence_bert-saved")

# embedding_dim has to be 384 to match with the model
document_store = FAISSDocumentStore(
    faiss_index_factory_str="Flat", sql_url=sqlUrlFAQ,
    similarity='cosine',
    index="document", embedding_field="question_emb", excluded_meta_data=["question_emb"], embedding_dim=384)


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

faqRetriever = EmbeddingRetriever(
    document_store=document_store,
    embedding_model=Path("./faq-model-saved"),
    model_format="sentence_transformers", use_gpu=False)


# Get dataframe with columns "question", "answer" and some custom metadata
df = pd.read_csv("faq.csv")
# Minimal cleaning
df.fillna(value="", inplace=True)
df["question"] = df["question"].apply(lambda x: x.strip())
print(df.head())

# Get embeddings for our questions from the FAQs
questions = list(df["question"].values)
# update_embeddings
df["question_emb"] = faqRetriever.embed_queries(texts=questions)
df = df.rename(columns={"question": "content"})

# Convert Dataframe to list of dicts and index them in our DocumentStore
docs_to_index = df.to_dict(orient="records")
document_store.delete_documents()
document_store.write_documents(docs_to_index)
print(document_store)

# still need to update embedding
document_store.update_embeddings(faqRetriever)
document_store.save("faq-faiss-index.faiss")

# test loading
FAISSDocumentStore.load("faq-faiss-index.faiss")
