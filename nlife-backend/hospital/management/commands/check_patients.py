from django.core.management.base import BaseCommand
from hospital.models import Patient
from accounts.models import User
from hospital.serializers import PatientSerializer
import json

class Command(BaseCommand):
    help = 'Check patients data and serialization'

    def handle(self, *args, **options):
        self.stdout.write('Checking patients data...')
        
        # Check total users
        total_users = User.objects.count()
        self.stdout.write(f'Total users: {total_users}')
        
        # Check total patients
        total_patients = Patient.objects.count()
        self.stdout.write(f'Total patients: {total_patients}')
        
        # List all users
        self.stdout.write('\nAll users:')
        for user in User.objects.all():
            self.stdout.write(f'  - {user.id}: {user.email} ({user.first_name} {user.last_name}) - Type: {user.user_type}')
        
        # List all patients
        self.stdout.write('\nAll patients:')
        for patient in Patient.objects.all():
            self.stdout.write(f'  - Patient {patient.id}: {patient.user.email}')
            
        # Test serialization
        self.stdout.write('\nTesting serialization:')
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        
        self.stdout.write(f'Serialized data:')
        self.stdout.write(json.dumps(serializer.data, indent=2, default=str))
