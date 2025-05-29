#!/usr/bin/env python
"""
Test script to verify doctor update authentication
"""

import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nlife_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from hospital.models import Doctor

User = get_user_model()

def test_doctor_update():
    print("🧪 Testing Doctor Update Authentication")
    print("=" * 50)
    
    # Get admin token
    print("1. Getting admin token...")
    login_response = requests.post('http://localhost:8000/api/auth/token/', {
        'email': 'admin@nlife.com',
        'password': 'admin123'
    })
    
    if login_response.status_code == 200:
        admin_token = login_response.json()['access']
        print(f"✅ Admin token obtained: {admin_token[:20]}...")
    else:
        print(f"❌ Failed to get admin token: {login_response.status_code}")
        return
    
    # Get first doctor
    print("\n2. Getting first doctor...")
    doctors_response = requests.get('http://localhost:8000/api/doctors/')
    
    if doctors_response.status_code == 200:
        doctors = doctors_response.json()
        if doctors:
            doctor = doctors[0]
            doctor_id = doctor['id']
            print(f"✅ Found doctor: {doctor['user']['first_name']} {doctor['user']['last_name']} (ID: {doctor_id})")
        else:
            print("❌ No doctors found")
            return
    else:
        print(f"❌ Failed to get doctors: {doctors_response.status_code}")
        return
    
    # Test update without token (should fail)
    print("\n3. Testing update without authentication...")
    update_data = {
        'first_name': 'Updated',
        'last_name': 'Name',
        'email': doctor['user']['email'],
        'phone_number': doctor['user']['phone_number'],
        'specialty': doctor['specialty']['id'],
        'consultation_fee': 600,
        'bio': 'Updated bio'
    }
    
    no_auth_response = requests.put(
        f'http://localhost:8000/api/doctors/{doctor_id}/',
        data=update_data
    )
    
    if no_auth_response.status_code == 401:
        print("✅ Correctly rejected request without authentication (401)")
    else:
        print(f"❌ Unexpected response without auth: {no_auth_response.status_code}")
    
    # Test update with admin token (should succeed)
    print("\n4. Testing update with admin authentication...")
    auth_response = requests.put(
        f'http://localhost:8000/api/doctors/{doctor_id}/',
        data=update_data,
        headers={'Authorization': f'Bearer {admin_token}'}
    )
    
    if auth_response.status_code == 200:
        print("✅ Successfully updated doctor with admin token")
        updated_doctor = auth_response.json()
        print(f"   Updated name: {updated_doctor.get('user', {}).get('first_name', 'N/A')} {updated_doctor.get('user', {}).get('last_name', 'N/A')}")
    else:
        print(f"❌ Failed to update doctor with admin token: {auth_response.status_code}")
        print(f"   Response: {auth_response.text}")
    
    print("\n🎉 Test completed!")

if __name__ == '__main__':
    test_doctor_update()
