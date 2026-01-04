FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for NeuTTS Air
# espeak-ng: Required for phonemizer
# ffmpeg: Required for audio processing
# git: Required to clone NeuTTS Air
RUN apt-get update && apt-get install -y \
    espeak-ng \
    ffmpeg \
    git \
    gcc \
    g++ \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Clone NeuTTS Air repository
RUN git clone https://github.com/neuphonic/neutts-air.git

# Install NeuTTS Air dependencies from the cloned repo
RUN pip install --no-cache-dir -r neutts-air/requirements.txt

# Copy and install our API requirements (FastAPI, uvicorn, etc.)
COPY tts-api/requirements.txt ./api-requirements.txt
RUN pip install --no-cache-dir -r api-requirements.txt

# Copy application code
COPY tts-api/app.py .

# Create temp directory for audio files
RUN mkdir -p /tmp

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8080/health')"

# Run the application
CMD ["python", "app.py"]
