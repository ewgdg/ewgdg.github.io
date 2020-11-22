import shutil
import os

# get documents that we want to query
dirname = os.path.dirname(__file__)
doc_dir = os.path.join(dirname, 'doc_dir')

#clean residues
try:
  shutil.rmtree(doc_dir)
except Exception as e:
  print(e)