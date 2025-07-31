#!/bin/bash

# Chatbot Docker Build Script
# Usage: 
#   ./start.sh dev                             # Run locally with Docker

set -e

# Check for local development mode
if [ "$1" = "dev" ]; then
    echo "🏠 Starting local development instance..."
    
    # Check if .env file exists for local secrets
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            echo "⚠️  Creating .env.local file from .env.example..."
            cp .env.example .env.local
        else
            echo "❌ .env.example file not found. Cannot create .env.local file."
            exit 1
        fi
        echo "📝 Please edit .env.local file with your actual values"
        exit 1
    fi
    
    # Build and run locally
    echo "🏗️  Building Docker image for local development..."
    docker build -t qa-chatbot-dev .
    
    echo "🚀 Starting local container on port 8082..."
    docker run --rm -p 8082:8080 --env-file .env.local qa-chatbot-dev
    exit 0
fi