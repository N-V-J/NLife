from django.core.management.base import BaseCommand
from hospital.models import Patient
from accounts.models import User
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Create test patients'

    def handle(self, *args, **options):
        self.stdout.write('Creating test patients...')
        
        # Create test users and patients
        test_patients = [
            {
                'email': 'patient1@test.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'phone_number': '+1234567890',
                'gender': 'male',
                'date_of_birth': '1990-01-15',
                'blood_group': 'A+',
                'emergency_contact': '+1234567891',
                'medical_history': 'No significant medical history',
                'allergies': 'None'
            },
            {
                'email': 'patient2@test.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'phone_number': '+1234567892',
                'gender': 'female',
                'date_of_birth': '1985-05-20',
                'blood_group': 'B+',
                'emergency_contact': '+1234567893',
                'medical_history': 'Diabetes Type 2',
                'allergies': 'Penicillin'
            },
            {
                'email': 'patient3@test.com',
                'first_name': 'Bob',
                'last_name': 'Johnson',
                'phone_number': '+1234567894',
                'gender': 'male',
                'date_of_birth': '1975-12-10',
                'blood_group': 'O-',
                'emergency_contact': '+1234567895',
                'medical_history': 'Hypertension',
                'allergies': 'Shellfish'
            }
        ]
        
        for patient_data in test_patients:
            # Check if user already exists
            if User.objects.filter(email=patient_data['email']).exists():
                self.stdout.write(f'User {patient_data["email"]} already exists, skipping...')
                continue
                
            # Create user
            user = User.objects.create(
                email=patient_data['email'],
                first_name=patient_data['first_name'],
                last_name=patient_data['last_name'],
                phone_number=patient_data['phone_number'],
                gender=patient_data['gender'],
                date_of_birth=patient_data['date_of_birth'],
                blood_group=patient_data['blood_group'],
                user_type='patient',
                password=make_password('password123')
            )
            
            # Create patient profile
            patient = Patient.objects.create(
                user=user,
                emergency_contact=patient_data['emergency_contact'],
                medical_history=patient_data['medical_history'],
                allergies=patient_data['allergies'],
                date_of_birth=patient_data['date_of_birth'],
                blood_group=patient_data['blood_group']
            )
            
            self.stdout.write(f'Created patient: {patient.user.first_name} {patient.user.last_name}')
        
        self.stdout.write(self.style.SUCCESS('Test patients created successfully!'))
