from haystack import Finder
from haystack.preprocessor.cleaning import clean_wiki_text
from haystack.preprocessor.utils import convert_files_to_dicts, fetch_archive_from_http
from haystack.reader.farm import FARMReader
from haystack.reader.transformers import TransformersReader
from haystack.utils import print_answers

# In-Memory Document Store
# from haystack.document_store.memory import InMemoryDocumentStore
# document_store = InMemoryDocumentStore()

from haystack.document_store.sql import SQLDocumentStore
document_store = SQLDocumentStore(url="sqlite:///qa.db")

import shutil
import os

# Let's first get some documents that we want to query
# Here: 517 Wikipedia articles for Game of Thrones
doc_dir = "data/article_txt_got2"
# s3_url = "https://drive.google.com/uc?export=download&id=1tgQhrDu5cZJ9xp2Uj3rzfa0j0OuW3UPV" # "https://s3.eu-central-1.amazonaws.com/deepset.ai-farm-qa/datasets/documents/wiki_gameofthrones_txt.zip"
# fetch_archive_from_http(url=s3_url, output_dir=doc_dir)

# convert files to dicts containing documents that can be indexed to our datastore
# You can optionally supply a cleaning function that is applied to each doc (e.g. to remove footers)
# It must take a str as input, and return a str.
dicts = convert_files_to_dicts(dir_path=doc_dir, clean_func=clean_wiki_text, split_paragraphs=True)

# We now have a list of dictionaries that we can write to our document store.
# If your texts come from a different source (e.g. a DB), you can of course skip convert_files_to_dicts() and create the dictionaries yourself.
# The default format here is: {"name": "<some-document-name>, "text": "<the-actual-text>"}

# Let's have a look at the first 3 entries:
# print(dicts[:3])
# Now, let's write the docs to our DB.
document_store.delete_all_documents()
document_store.write_documents(dicts)


from haystack.retriever.sparse import TfidfRetriever
retriever = TfidfRetriever(document_store=document_store)

reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=False, no_ans_boost=0)

finder = Finder(reader, retriever)


from fastapi import APIRouter
from fastapi import FastAPI
import json
import logging
logger = logging.getLogger('haystack')
logger.setLevel('INFO')

# router = APIRouter()
app = FastAPI()



@app.get("/doc-qa/{question}")
def doc_qa(question: str):
    
  results = finder.get_answers(question=question, top_k_retriever=1, top_k_reader=1)['answers']
  return {"results": results}