FROM python:3.9-slim
WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential pkg-config default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]