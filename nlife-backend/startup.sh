#!/bin/bash

# NLife Backend Startup Script
# This script handles database migrations and starts the server

set -e  # Exit on any error

echo "🚀 Starting NLife Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
python -c "
import os
import time
import psycopg2
from urllib.parse import urlparse

max_retries = 30
retry_count = 0

database_url = os.environ.get('DATABASE_URL')
if database_url:
    parsed = urlparse(database_url)
    while retry_count < max_retries:
        try:
            conn = psycopg2.connect(
                host=parsed.hostname,
                port=parsed.port,
                user=parsed.username,
                password=parsed.password,
                database=parsed.path[1:]
            )
            conn.close()
            print('✅ Database connection successful!')
            break
        except psycopg2.OperationalError:
            retry_count += 1
            print(f'⏳ Database not ready, retrying... ({retry_count}/{max_retries})')
            time.sleep(2)
    else:
        print('❌ Database connection failed after maximum retries')
        exit(1)
else:
    print('⚠️  No DATABASE_URL found, skipping connection check')
"

# Check for pending migrations
echo "🔍 Checking for pending migrations..."
python manage.py showmigrations --plan | grep '\[ \]' && HAS_PENDING=true || HAS_PENDING=false

if [ "$HAS_PENDING" = true ]; then
    echo "📦 Running database migrations..."
    python manage.py migrate --noinput
else
    echo "✅ No pending migrations found"
fi

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create superuser if it doesn't exist
echo "👤 Creating superuser if needed..."
python create_superuser.py --force

# Health check
echo "🏥 Running health check..."
python -c "
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nlife_project.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.db import connection

try:
    # Test database connection
    with connection.cursor() as cursor:
        cursor.execute('SELECT 1')
    print('✅ Database health check passed')
    
    # Test models
    from hospital.models import Specialty, Doctor, Patient
    print(f'✅ Models accessible: {Specialty._meta.label}, {Doctor._meta.label}, {Patient._meta.label}')
    
except Exception as e:
    print(f'❌ Health check failed: {e}')
    exit(1)
"

echo "🎉 NLife Backend startup completed successfully!"

# Start the server
echo "🌐 Starting Gunicorn server..."
exec gunicorn nlife_project.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --keep-alive 2 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile -
