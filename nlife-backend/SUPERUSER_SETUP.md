# Superuser Creation Guide

This document explains how to create a superuser for the NLife Django project using the automated tools provided.

## Default Credentials

- **Email**: admin@nlife.com
- **Password**: admin123
- **Name**: Admin User
- **User Type**: admin

## Method 1: Using the Django Management Command

### Basic Usage
```bash
python manage.py create_superuser_auto
```

### With Custom Parameters
```bash
python manage.py create_superuser_auto --email custom@admin.com --password mypassword --first-name John --last-name Doe
```

### Force Update Existing User
```bash
python manage.py create_superuser_auto --force
```

### Available Options
- `--email`: Email for the superuser (default: admin@nlife.com)
- `--password`: Password for the superuser (default: admin123)
- `--first-name`: First name for the superuser (default: Admin)
- `--last-name`: Last name for the superuser (default: User)
- `--force`: Force creation even if user exists (will update existing user)

## Method 2: Using the Standalone Automation Script

### Basic Usage
```bash
python create_superuser.py
```

### Force Update Existing User
```bash
python create_superuser.py --force
```

## Features

### Management Command Features
- ✅ Customizable email, password, and name
- ✅ Safe handling of existing users
- ✅ Force update option
- ✅ Detailed success/error messages
- ✅ Django-style colored output

### Automation Script Features
- ✅ Standalone execution (no need for manage.py)
- ✅ User-friendly emoji output
- ✅ Automatic Django environment setup
- ✅ Force update option
- ✅ Detailed user information display

## Usage Scenarios

### Development Setup
For quick development setup, use the automation script:
```bash
python create_superuser.py
```

### Production Deployment
For production deployment with custom credentials:
```bash
python manage.py create_superuser_auto --email admin@yourcompany.com --password secure_password --first-name Admin --last-name Team
```

### CI/CD Pipeline
For automated deployment pipelines:
```bash
python create_superuser.py --force
```

## Security Notes

⚠️ **Important**: The default password `admin123` is for development purposes only. Always use strong, unique passwords in production environments.

## Troubleshooting

### User Already Exists
If you see "User already exists" message, use the `--force` flag to update the existing user.

### Django Import Errors
Make sure you're in the correct directory and the virtual environment is activated:
```bash
cd nlife-backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Permission Errors
Ensure the database is accessible and you have the necessary permissions to create users.
