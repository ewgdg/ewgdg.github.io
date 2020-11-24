import shutil
import os

# get documents that we want to query
dirname = os.path.dirname(__file__)

configFile = os.path.join(dirname,'config.yaml')

import yaml

config = None
with open(configFile) as file:
  config = yaml.safe_load(file)

doc_dir = os.path.join(dirname, config['docDir'])
#clean residues
try:
  shutil.rmtree(doc_dir)
except Exception as e:
  print(e)