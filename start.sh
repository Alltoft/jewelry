#!/bin/bash

# Wait for database to be ready (modify according to your DB type)
while ! nc -z srv-captain--meral-database-db 3306; do
  echo "Waiting for database connection..."
  sleep 2
done

# Run migrations
flask db init
flask db migrate
flask db upgrade

# Start Gunicorn
exec gunicorn --bind 0.0.0.0:80 --workers 4 --timeout 120 "app:app"
