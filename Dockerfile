# Use official Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    FLASK_APP=run.py \
    FLASK_ENV=production

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    libssl-dev \
    libmariadb-dev \
    && rm -rf /var/lib/apt/lists/*

# Working directory setup
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create the product_pics directory if it doesn't exist
RUN mkdir -p /app/app/static/images/product_pics

# Define volume for product images
VOLUME ["/app/app/static/images/product_pics"]

CMD ["gunicorn", "--bind", "0.0.0.0:80", "--workers", "4", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
