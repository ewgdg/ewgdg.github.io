# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM deepset/haystack-cpu:1.3.0
# RUN apt-get -y install -f 
# RUN apt-get update -y
# RUN apt-get install git -y
# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True
ENV HAYSTACK_TELEMETRY_ENABLED False

# Copy local code to the container image.
ENV APP_HOME /chatbot
WORKDIR $APP_HOME
COPY ./config.yaml ./config.yaml
COPY ./faq.csv ./faq.csv

COPY ./downloadFaqModel.py ./downloadFaqModel.py
RUN python ./downloadFaqModel.py

COPY ./downloadQaModel.py ./downloadQaModel.py
RUN python ./downloadQaModel.py

# RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.node.sh | bash
# RUN curl -O https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh && bash script.deb.sh >&1 2>&1
# RUN apt-get update && apt-get install -y git-lfs
# RUN git lfs install
# RUN git clone https://huggingface.co/deepset/roberta-base-squad2

# install elasticsearch
# RUN wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.9.2-linux-x86_64.tar.gz -q
# RUN tar -xzf elasticsearch-7.9.2-linux-x86_64.tar.gz
# RUN chown -R daemon:daemon elasticsearch-7.9.2
# RUN rm elasticsearch-7.9.2-linux-x86_64.tar.gz

# RUN elasticsearch-7.9.2/bin/elasticsearch -d -p pid 
# RUN chmod +x *
# RUN ./wait-for-elasticsearch.sh http://elasticsearch:9200 echo ready
COPY ./preprocessFAQ.py ./preprocessFAQ.py
RUN python preprocessFAQ.py 

COPY ./doc_dir ./doc_dir
COPY ./preprocessQA.py ./preprocessQA.py
RUN python preprocessQA.py
RUN rm -rf ./pages 

COPY ./main.py ./main.py

# Install production dependencies.
# RUN pip install torch==1.7.0+cpu torchvision==0.8.1+cpu torchaudio==0.7.0 -f https://download.pytorch.org/whl/torch_stable.html
# RUN pip install farm-haystack --find-links https://download.pytorch.org/whl/torch_stable.html
# RUN python preprocessElastic.py
# RUN python preprocess.py
# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
# CMD ["python","main.py"]
# $PORT = 8080 in google cloud run env
CMD exec gunicorn main:app --bind :$PORT --workers 1 --threads 2 --worker-class uvicorn.workers.UvicornWorker --timeout 300
# CMD ["exec","elasticsearch-7.9.2/bin/elasticsearch","-d","./wait-for-elasticsearch.sh", "http://elasticsearch:9200", "gunicorn main:app --bind :$PORT --workers 1 --threads 4 -k uvicorn.workers.UvicornWorker -t 300"]
