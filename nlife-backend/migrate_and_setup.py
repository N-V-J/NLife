#!/usr/bin/env python
"""
Manual migration and setup script for NLife backend
Run this script after deployment to set up the database
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nlife_project.settings')
django.setup()

def run_migrations():
    """Run database migrations"""
    print("🔄 Running database migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate', '--noinput'])
        print("✅ Migrations completed successfully")
        return True
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def collect_static():
    """Collect static files"""
    print("📁 Collecting static files...")
    try:
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput', '--clear'])
        print("✅ Static files collected successfully")
        return True
    except Exception as e:
        print(f"❌ Static file collection failed: {e}")
        return False

def create_superuser():
    """Create superuser"""
    print("👤 Creating superuser...")
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Check if admin already exists
        if User.objects.filter(email='admin@nlife.com').exists():
            print("✅ Admin user already exists")
            return True
            
        # Create admin user
        admin_user = User.objects.create_user(
            email='admin@nlife.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            user_type='admin',
            is_staff=True,
            is_superuser=True
        )
        print("✅ Superuser created successfully")
        print("📧 Email: admin@nlife.com")
        print("🔑 Password: admin123")
        return True
    except Exception as e:
        print(f"❌ Superuser creation failed: {e}")
        return False

def test_database():
    """Test database connection"""
    print("🔍 Testing database connection...")
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Starting NLife backend setup...")
    
    success = True
    
    # Test database connection first
    if not test_database():
        success = False
    
    # Run migrations
    if success and not run_migrations():
        success = False
    
    # Collect static files
    if success and not collect_static():
        success = False
    
    # Create superuser
    if success and not create_superuser():
        success = False
    
    if success:
        print("🎉 Setup completed successfully!")
        print("🌐 Your NLife backend is ready to use")
    else:
        print("❌ Setup failed. Please check the errors above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
