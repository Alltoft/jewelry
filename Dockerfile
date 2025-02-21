# Use official Python image (slim version for smaller size)
FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    FLASK_APP=run.py \
    FLASK_ENV=production \
    FLASK_DEBUG=0

# Install system dependencies for PostgreSQL/MySQL and image processing
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Create and set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code (use .dockerignore to exclude unnecessary files)
COPY . .

# Create necessary directories
RUN mkdir -p static/images/product_pics static/images/temp

# Use a startup script to ensure DB connectivity
RUN chmod +x ./start.sh

CMD ["./start.sh"]
