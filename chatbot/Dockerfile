# Build stage
FROM python:3.13-slim AS builder

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set work directory
WORKDIR /app

# Copy dependency files for better Docker layer caching
COPY pyproject.toml uv.lock ./

ENV UV_LINK_MODE=copy
ENV UV_COMPILE_BYTECODE=1

# Install uv and Python dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=from=ghcr.io/astral-sh/uv,source=/uv,target=/bin/uv \
    uv sync --frozen

# Runtime stage
FROM python:3.13-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
# ENV PYTHONDONTWRITEBYTECODE=1

# Set work directory
WORKDIR /app

# Copy virtual environment from builder stage
COPY --from=builder /app/.venv /app/.venv

# Copy application files
COPY openai_chatbot.py .
COPY faq.csv .

# Create non-root user for security and clean up
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app \
    && rm -rf /var/cache/apt/* /tmp/*
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')" || exit 1

# Expose port
EXPOSE 8080

# Add virtual environment to PATH
ENV PATH="/app/.venv/bin:$PATH"

# Run the application
CMD ["python", "-m", "openai_chatbot"]