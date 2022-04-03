from pathlib import Path
import os

from haystack.nodes import FARMReader

# from transformers.pipelines import pipeline
# import pprint
# from farm.infer import Inferencer
# from farm.conversion.transformers import Converter
# from farm.modeling.tokenization import Tokenizer
# from farm.modeling.adaptive_model import AdaptiveModel

# from transformers import AutoTokenizer, AutoModel, AutoConfig

# modelName = "deepset/minilm-uncased-squad2"
modelName = "distilbert-base-uncased-distilled-squad"

# for TransformerReader
# config = AutoConfig.from_pretrained(modelName)
# tokenizer = AutoTokenizer.from_pretrained(
#     pretrained_model_name_or_path=modelName, config=config)
# model = AutoModel.from_pretrained(
#     pretrained_model_name_or_path=modelName, config=config)

reader = FARMReader(modelName)


savePath = "./qa-model-saved"
# tokenizer.save_pretrained(savePath)
# model.save_pretrained(savePath)
# config.save_pretrained(savePath)
reader.save(Path(savePath))
