# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM deepset/haystack-cpu:0.5.0
# RUN apt-get -y install -f 
# RUN apt-get update -y
# RUN apt-get install git -y
# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Copy local code to the container image.
ENV APP_HOME .
WORKDIR $APP_HOME
COPY . ./

# RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.node.sh | bash
# RUN curl -O https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh && bash script.deb.sh >&1 2>&1
# RUN apt-get update && apt-get install -y git-lfs
# RUN git lfs install
# RUN git clone https://huggingface.co/deepset/roberta-base-squad2

# Install production dependencies.
# RUN pip install torch==1.7.0+cpu torchvision==0.8.1+cpu torchaudio==0.7.0 -f https://download.pytorch.org/whl/torch_stable.html
# RUN pip install farm-haystack --find-links https://download.pytorch.org/whl/torch_stable.html
RUN python preprocess.py
# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
# CMD ["python","main.py"]
CMD exec gunicorn main:app --bind :$PORT --workers 1 --threads 4 -k uvicorn.workers.UvicornWorker -t 300
