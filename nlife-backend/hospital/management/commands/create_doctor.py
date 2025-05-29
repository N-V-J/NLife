from django.core.management.base import BaseCommand
from hospital.models import Specialty, Doctor
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a test doctor'

    def handle(self, *args, **options):
        # Create a test user
        email = 'test.doctor@example.com'
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists'))
            user = User.objects.get(email=email)
        else:
            user = User.objects.create_user(
                email=email,
                password='password123',
                first_name='Test',
                last_name='Doctor',
                user_type='doctor',
                gender='male'
            )
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.email}'))
        
        # Get or create specialty
        specialty, created = Specialty.objects.get_or_create(name='General physician')
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created specialty: {specialty.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Specialty {specialty.name} already exists'))
        
        # Check if doctor already exists
        if Doctor.objects.filter(user=user).exists():
            self.stdout.write(self.style.WARNING(f'Doctor with user {user.email} already exists'))
            doctor = Doctor.objects.get(user=user)
        else:
            # Create doctor profile
            try:
                doctor = Doctor.objects.create(
                    user=user,
                    specialty=specialty,
                    education='Medical School',
                    experience_years=5,
                    bio='Test doctor bio',
                    consultation_fee=500,
                    available_days='Monday,Tuesday,Wednesday',
                    start_time=datetime.strptime('09:00', '%H:%M').time(),
                    end_time=datetime.strptime('17:00', '%H:%M').time(),
                    is_featured=True
                )
                self.stdout.write(self.style.SUCCESS(f'Created doctor: {doctor.user.email}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating doctor: {str(e)}'))
                import traceback
                self.stdout.write(traceback.format_exc())
