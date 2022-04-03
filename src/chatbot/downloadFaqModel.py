from transformers import AutoTokenizer, AutoModel, AutoConfig

modelName = "sentence-transformers/all-MiniLM-L6-v2"
config = AutoConfig.from_pretrained(modelName)
tokenizer = AutoTokenizer.from_pretrained(
    pretrained_model_name_or_path=modelName, config=config)
model = AutoModel.from_pretrained(
    pretrained_model_name_or_path=modelName, config=config)

savePath = "./faq-model-saved"
tokenizer.save_pretrained(savePath)
model.save_pretrained(savePath)
config.save_pretrained(savePath)
