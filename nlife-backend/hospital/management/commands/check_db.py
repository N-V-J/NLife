from django.core.management.base import BaseCommand
from hospital.models import Specialty, Doctor
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Check database tables'

    def handle(self, *args, **options):
        self.stdout.write('Checking Specialty table...')
        specialties = Specialty.objects.all()
        self.stdout.write(f'Found {specialties.count()} specialties:')
        for specialty in specialties:
            self.stdout.write(f'- {specialty.id}: {specialty.name}')

        self.stdout.write('\nChecking Doctor table...')
        doctors = Doctor.objects.all()
        self.stdout.write(f'Found {doctors.count()} doctors:')
        for doctor in doctors:
            self.stdout.write(f'- {doctor.id}: {doctor.user.email} - {doctor.specialty}')

        self.stdout.write('\nChecking User table...')
        users = User.objects.all()
        self.stdout.write(f'Found {users.count()} users:')
        for user in users:
            self.stdout.write(f'- {user.id}: {user.email} - {user.user_type}')
