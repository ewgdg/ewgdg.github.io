from haystack.preprocessor.cleaning import clean_wiki_text
from haystack.preprocessor.utils import convert_files_to_dicts
# from haystack.preprocessor.utils import tika_convert_files_to_dicts
from haystack.document_store.sql import SQLDocumentStore
from haystack.document_store.faiss import FAISSDocumentStore
# from haystack.reader.transformers import TransformersReader
# from haystack.reader.farm import FARMReader
# from transformers import 
# from transformers.PreTrainedModel import from_pretrained
from haystack.retriever.dense import EmbeddingRetriever
import os
import shutil
# get documents that we want to query
dirname = os.path.dirname(__file__)

configFile = os.path.join(dirname,'config.yaml')

import yaml

config = None
with open(configFile) as file:
  config = yaml.safe_load(file)


modelName =config["model"]
sqlUrl = config["sqlUrl"]
modelDir =config["modelDir"]
doc_dir = os.path.join(dirname,config["docDir"])

# download and save the model
from farm.modeling.adaptive_model import AdaptiveModel
from farm.data_handler.processor import Processor

model = AdaptiveModel.convert_from_transformers(modelName, device="cpu", task_type="question_answering")
processor = Processor.convert_from_transformers(modelName, task_type="question_answering", max_seq_len=384, doc_stride=128)
model.save(modelDir)
processor.save(modelDir)


# try:
# //or we should config the cache_dir on from_pretrain # dont rely on cache , must save it with save()
# model = TransformersReader(model_name_or_path=modelName, use_gpu=-1) 
  # model = FARMReader(model_name_or_path=modelName,
  #                                use_gpu=False, no_ans_boost=0)
# except:
#   pass;  


document_store = SQLDocumentStore(url=sqlUrl)
# document_store = FAISSDocumentStore(sql_url=sqlUrl)




# convert files to dicts containing documents that can be indexed to our datastore
# You can optionally supply a cleaning function that is applied to each doc (e.g. to remove footers)
# It must take a str as input, and return a str.
dicts = convert_files_to_dicts(dir_path=doc_dir, clean_func=clean_wiki_text, split_paragraphs=False)
# dicts = tika_convert_files_to_dicts(dir_path=doc_dir,clean_func=clean_wiki_text, split_paragraphs=False)

# We now have a list of dictionaries that we can write to our document store.
# If your texts come from a different source (e.g. a DB), you can of course skip convert_files_to_dicts() and create the dictionaries yourself.
# The default format here is: {"name": "<some-document-name>, "text": "<the-actual-text>"}

# Let's have a look at the first 3 entries:
# print(dicts[:3])
# Now, let's write the docs to our DB.
document_store.delete_all_documents()
document_store.write_documents(dicts)

# retriever = EmbeddingRetriever(
#     document_store=document_store, embedding_model="sentence_bert-saved", use_gpu=False)
# document_store.update_embeddings(retriever)
# document_store.save('faiss1')

#clean residues
try:
  shutil.rmtree(doc_dir)
except Exception as e:
  print(e)