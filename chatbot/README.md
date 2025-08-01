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

On google cloud console secret manager, add openai-qa-chatbot-secret.

### 3. Set Project Variables

On github secrets and variables, add vars according to the workflow file.

## Deployment Options

### Github actions

create google Workload Identity Federation.
see <https://github.com/google-github-actions>.

in google console IAM page, click grant access.
grant your workload identity federation principalSet access to cloud-run and artifact-registry and secret-manager.
the principal set looks like:
```
${REPO} is the full repo name including the parent GitHub organization, such as "my-org/my-repo".
${WORKLOAD_IDENTITY_POOL_ID} can be printed on cloud shell with command:
gcloud iam workload-identity-pools describe "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --format="value(name)"

principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO}
```

note that if identity federation impersonates a service account with google-github-actions/auth, then the token type need to be access_token.
it might also need serviceAccountUser or workloadIdentityUser access to a service account for the deploy action.
see <https://github.com/google-github-actions/deploy-cloudrun>.

### Google cloud-run continuously deployment from github connection

On cloud-run page, setup deploy from github repo.
