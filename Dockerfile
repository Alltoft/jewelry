FROM python:3.9-slim

ENV PYTHONUNBUFFERED 1

ENV LOG_LEVEL=INFO

RUN apt-get update && \
apt-get install -y build-essential pkg-config default-libmysqlclient-dev && \
rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"] 