from haystack.preprocessor.cleaning import clean_wiki_text
from haystack.preprocessor.utils import convert_files_to_dicts
from haystack.document_store.sql import SQLDocumentStore
from haystack.reader.transformers import TransformersReader
# from transformers.PreTrainedModel import from_pretrained

# download the model
try:
  model = TransformersReader(model_name_or_path="distilbert-base-uncased-distilled-squad", tokenizer="distilbert-base-uncased", use_gpu=-1)
except:
  pass;  


document_store = SQLDocumentStore(url="sqlite:///qa.db")


import os
import shutil
# get documents that we want to query
dirname = os.path.dirname(__file__)
doc_dir = os.path.join(dirname, 'doc_dir')

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



#clean residues
try:
  shutil.rmtree(doc_dir)
except Exception as e:
  print(e)