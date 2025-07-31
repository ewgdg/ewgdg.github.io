# Chatbot Deployment Guide

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **OpenAI API Key**

## Setup

### 1. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Create OpenAI API Secret

in google cloud console secret manager, add openai-qa-chatbot-secret.

### 3. Set Project Variables

in github secrets and variables, add vars according to the workflow file.

## Deployment Options

### Github actions

create google Workload Identity Federation
<https://github.com/google-github-actions>

in google console IAM/service accounts page, create service account with cloud-run developer and artifact-registry administrator roles.
grant access for impersonating the service account to your workload identity federation principle with a workloadIdentityUser role.
or directly grant assign the cloud-run and artifact-registry roles to your identity federation.
the principle set looks like:

```
${REPO} is the full repo name including the parent GitHub organization, such as "my-org/my-repo".
${WORKLOAD_IDENTITY_POOL_ID} can be printed on cloud shell with command:
gcloud iam workload-identity-pools describe "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --format="value(name)"

principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO}
```

### Google cloud-run continuously deployment from github connection

setup deploy from github repo.
