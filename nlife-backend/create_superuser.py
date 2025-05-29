#!/usr/bin/env python
"""
Superuser Automation Script for NLife Django Project

This script automatically creates a superuser with predefined credentials:
- Email: admin@nlife.com
- Password: admin123

Usage:
    python create_superuser.py [--force]

Options:
    --force    Force creation even if user exists (will update existing user)
"""

import os
import sys
import django
from django.core.management import execute_from_command_line


def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nlife_project.settings')
    django.setup()


def create_superuser(force=False):
    """Create superuser using the custom management command"""
    try:
        # Import here after Django is set up
        from django.contrib.auth import get_user_model
        from django.db import IntegrityError
        
        User = get_user_model()
        
        email = 'admin@nlife.com'
        password = 'admin123'
        first_name = 'Admin'
        last_name = 'User'
        
        print("🚀 NLife Superuser Creation Script")
        print("=" * 40)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            if force:
                user = User.objects.get(email=email)
                user.set_password(password)
                user.is_staff = True
                user.is_superuser = True
                user.is_active = True
                user.first_name = first_name
                user.last_name = last_name
                user.user_type = 'admin'
                user.save()
                print(f"✅ Successfully updated existing user '{email}' to superuser")
            else:
                print(f"⚠️  User with email '{email}' already exists.")
                print("   Use --force flag to update existing user.")
                return False
        else:
            # Create new superuser
            user = User.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                user_type='admin'
            )
            print(f"✅ Successfully created superuser '{email}'")
        
        # Display user information
        print("\n📋 Superuser Details:")
        print(f"   Email: {user.email}")
        print(f"   Name: {user.first_name} {user.last_name}")
        print(f"   User Type: {user.user_type}")
        print(f"   Is Staff: {user.is_staff}")
        print(f"   Is Superuser: {user.is_superuser}")
        print(f"   Is Active: {user.is_active}")
        
        print("\n🎉 Superuser creation completed successfully!")
        print("\n💡 You can now login to Django admin with:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        
        return True
        
    except IntegrityError as e:
        print(f"❌ Error creating superuser: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False


def main():
    """Main function"""
    # Check for force flag
    force = '--force' in sys.argv
    
    try:
        # Setup Django
        setup_django()
        
        # Create superuser
        success = create_superuser(force=force)
        
        if success:
            sys.exit(0)
        else:
            sys.exit(1)
            
    except ImportError as e:
        print("❌ Django import error. Make sure you're in the correct directory and Django is installed.")
        print(f"   Error: {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Script error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()
