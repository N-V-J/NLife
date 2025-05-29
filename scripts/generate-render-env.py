#!/usr/bin/env python3
"""
Script to generate environment variables for Render deployment
"""

import secrets
import string

def generate_secret_key(length=50):
    """Generate a secure Django secret key"""
    characters = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(characters) for _ in range(length))

def main():
    print("=== Render Environment Variables Generator ===\n")
    
    # Generate Django secret key
    secret_key = generate_secret_key()
    
    print("📋 Copy these environment variables to your Render services:\n")
    
    print("🔧 BACKEND SERVICE ENVIRONMENT VARIABLES:")
    print("=" * 50)
    print(f"DJANGO_SECRET_KEY={secret_key}")
    print("DJANGO_DEBUG=False")
    print("DJANGO_ALLOWED_HOSTS=your-backend-service.onrender.com,localhost")
    print("CORS_ALLOWED_ORIGINS=https://your-frontend-service.onrender.com")
    print("DATABASE_URL=<your-render-postgresql-internal-url>")
    print()
    
    print("🌐 FRONTEND SERVICE ENVIRONMENT VARIABLES:")
    print("=" * 50)
    print("REACT_APP_API_URL=https://your-backend-service.onrender.com/api")
    print()
    
    print("📝 INSTRUCTIONS:")
    print("=" * 50)
    print("1. Replace 'your-backend-service' with your actual Render backend service name")
    print("2. Replace 'your-frontend-service' with your actual Render frontend service name")
    print("3. Replace '<your-render-postgresql-internal-url>' with the internal database URL from Render")
    print("4. Add these variables in the Render dashboard under 'Environment' for each service")
    print()
    
    print("🔒 SECURITY NOTES:")
    print("=" * 50)
    print("- Keep your DJANGO_SECRET_KEY secure and never commit it to version control")
    print("- Use the INTERNAL database URL for better performance and security")
    print("- Only include your actual domains in ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS")
    print("- Always set DJANGO_DEBUG=False in production")

if __name__ == "__main__":
    main()
