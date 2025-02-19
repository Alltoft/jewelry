# Use Ubuntu as the base image
FROM ubuntu:22.04

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    LOG_LEVEL=INFO \
    FLASK_APP=run.py \
    FLASK_ENV=production

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    pkg-config \
    default-libmysqlclient-dev \
    python3.9 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Set up the working directory
WORKDIR /app

# Upgrade pip and install Python dependencies
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Run migrations and start the app
CMD flask db upgrade && \
    gunicorn --bind 0.0.0.0:80 --workers 4 app:app