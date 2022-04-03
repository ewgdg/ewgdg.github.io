# from farm.data_handler.processor import Processor
# from farm.modeling.adaptive_model import AdaptiveModel
import yaml
from haystack.utils import clean_wiki_text, convert_files_to_dicts

from haystack.document_stores import SQLDocumentStore
# from haystack.document_store.faiss import FAISSDocumentStore
# from haystack.reader.transformers import TransformersReader
# from haystack.reader.farm import FARMReader
# from transformers import
# from transformers.PreTrainedModel import from_pretrained
# from haystack.retriever.dense import EmbeddingRetriever
import os
import shutil
from haystack.nodes import MarkdownConverter

# get documents that we want to query
dirname = os.path.dirname(__file__)

configFile = os.path.join(dirname, 'config.yaml')


config = None
with open(configFile) as file:
    config = yaml.safe_load(file)


# modelName = config["model"]
sqlUrl = config["sqlUrl"]
# modelDir = config["modelDir"]
doc_dir = os.path.join(dirname, config["docDir"])


converter = MarkdownConverter(
    remove_numeric_tables=True, valid_languages=["en"])


document_store = SQLDocumentStore(url=sqlUrl)
# document_store = FAISSDocumentStore(sql_url=sqlUrl)


# convert files to dicts containing documents that can be indexed to our datastore
# You can optionally supply a cleaning function that is applied to each doc (e.g. to remove footers)
# It must take a str as input, and return a str.
docs = convert_files_to_dicts(
    dir_path=doc_dir, clean_func=clean_wiki_text, split_paragraphs=True)

# docs = []
# for curDir, subdirList, fileList in os.walk(doc_dir):
#     print('Found directory: %s' % os.path.basename(curDir))
#     for fname in fileList:
#         print('\t%s' % fname)
#         fPath = os.path.join(curDir, fname)
#         if fname.endswith(".md"):
#             converted = converter.convert(file_path=fPath, meta={})
#             docs.extend(converted)

# dicts = tika_convert_files_to_dicts(dir_path=doc_dir,clean_func=clean_wiki_text, split_paragraphs=False)

# We now have a list of dictionaries that we can write to our document store.
# If your texts come from a different source (e.g. a DB), you can of course skip convert_files_to_dicts() and create the dictionaries yourself.
# The default format here is: {"name": "<some-document-name>, "text": "<the-actual-text>"}

# Let's have a look at the first 3 entries:
print(docs[:3])
# Now, let's write the docs to our DB.
document_store.delete_documents()
document_store.write_documents(docs)

# retriever = EmbeddingRetriever(
#     document_store=document_store, embedding_model="sentence_bert-saved", use_gpu=False)
# document_store.update_embeddings(retriever)
# document_store.save('faiss1')

# clean residues
# try:
#     shutil.rmtree(doc_dir)
# except Exception as e:
#     print(e)
