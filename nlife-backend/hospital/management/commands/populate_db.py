import random
from datetime import datetime, timedelta, time
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hospital.models import Specialty, Doctor, Patient, Appointment, Review, TimeSlot

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating database...')

        # Create specialties
        self.create_specialties()

        # Create doctors
        self.create_doctors()

        # Create patients
        self.create_patients()

        # Create appointments
        self.create_appointments()

        # Create reviews
        self.create_reviews()

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))

    def create_specialties(self):
        specialties = [
            {'name': 'General physician', 'description': 'Treats a wide range of medical conditions'},
            {'name': 'Cardiologist', 'description': 'Specializes in diagnosing and treating heart conditions'},
            {'name': 'Dermatologist', 'description': 'Specializes in skin conditions'},
            {'name': 'Neurologist', 'description': 'Specializes in disorders of the nervous system'},
            {'name': 'Orthopedic', 'description': 'Specializes in musculoskeletal system'},
            {'name': 'Pediatrician', 'description': 'Specializes in medical care for children'},
            {'name': 'Psychiatrist', 'description': 'Specializes in mental health'},
            {'name': 'Gynecologist', 'description': 'Specializes in female reproductive health'},
            {'name': 'Ophthalmologist', 'description': 'Specializes in eye care'},
            {'name': 'Dentist', 'description': 'Specializes in oral health'}
        ]

        for specialty_data in specialties:
            Specialty.objects.get_or_create(
                name=specialty_data['name'],
                defaults={'description': specialty_data['description']}
            )

        self.stdout.write(f'Created {len(specialties)} specialties')

    def create_doctors(self):
        specialties = Specialty.objects.all()

        doctors_data = [
            {
                'email': 'dr.smith@nlife.com',
                'first_name': 'John',
                'last_name': 'Smith',
                'password': 'doctor123',
                'specialty': 'General physician',
                'bio': 'Experienced general physician with over 10 years of practice.',
                'education': 'MD from Harvard Medical School',
                'experience_years': 10,
                'consultation_fee': 100.00,
                'is_featured': True
            },
            {
                'email': 'dr.johnson@nlife.com',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'password': 'doctor123',
                'specialty': 'Cardiologist',
                'bio': 'Specialized in treating heart conditions and cardiovascular diseases.',
                'education': 'MD from Johns Hopkins University',
                'experience_years': 15,
                'consultation_fee': 150.00,
                'is_featured': True
            },
            {
                'email': 'dr.williams@nlife.com',
                'first_name': 'Michael',
                'last_name': 'Williams',
                'password': 'doctor123',
                'specialty': 'Dermatologist',
                'bio': 'Expert in treating skin, hair, and nail conditions.',
                'education': 'MD from Stanford University',
                'experience_years': 8,
                'consultation_fee': 120.00,
                'is_featured': False
            },
            {
                'email': 'dr.brown@nlife.com',
                'first_name': 'Emily',
                'last_name': 'Brown',
                'password': 'doctor123',
                'specialty': 'Pediatrician',
                'bio': 'Dedicated to providing comprehensive healthcare for children.',
                'education': 'MD from Yale University',
                'experience_years': 12,
                'consultation_fee': 110.00,
                'is_featured': True
            },
            {
                'email': 'dr.davis@nlife.com',
                'first_name': 'Robert',
                'last_name': 'Davis',
                'password': 'doctor123',
                'specialty': 'Orthopedic',
                'bio': 'Specialized in treating musculoskeletal injuries and conditions.',
                'education': 'MD from Columbia University',
                'experience_years': 14,
                'consultation_fee': 140.00,
                'is_featured': False
            }
        ]

        for doctor_data in doctors_data:
            # Get specialty
            specialty = Specialty.objects.get(name=doctor_data['specialty'])

            # Create user
            user, created = User.objects.get_or_create(
                email=doctor_data['email'],
                defaults={
                    'first_name': doctor_data['first_name'],
                    'last_name': doctor_data['last_name'],
                    'user_type': 'doctor',
                    'is_active': True
                }
            )

            if created:
                user.set_password(doctor_data['password'])
                user.save()

            # Create or update doctor profile
            doctor, created = Doctor.objects.get_or_create(
                user=user,
                defaults={
                    'specialty': specialty,
                    'bio': doctor_data['bio'],
                    'education': doctor_data['education'],
                    'experience_years': doctor_data['experience_years'],
                    'consultation_fee': doctor_data['consultation_fee'],
                    'is_featured': doctor_data['is_featured'],
                    'is_available': True
                }
            )

            # Create time slots for the doctor
            if created:
                self.create_time_slots(doctor)

        self.stdout.write(f'Created {len(doctors_data)} doctors')

    def create_time_slots(self, doctor):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

        for day in days:
            TimeSlot.objects.create(
                doctor=doctor,
                day_of_week=day,
                start_time=time(9, 0),  # 9:00 AM
                end_time=time(17, 0),   # 5:00 PM
                is_available=True
            )

    def create_patients(self):
        patients_data = [
            {
                'email': 'patient1@example.com',
                'first_name': 'Richard',
                'last_name': 'James',
                'password': 'patient123',
                'phone_number': '+1 234 567 8901',
                'address': '123 Main St, New York, NY',
                'date_of_birth': '1995-05-15',
                'blood_group': 'A+'
            },
            {
                'email': 'patient2@example.com',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'password': 'patient123',
                'phone_number': '+1 234 567 8902',
                'address': '456 Oak St, Los Angeles, CA',
                'date_of_birth': '1988-10-20',
                'blood_group': 'O-'
            },
            {
                'email': 'patient3@example.com',
                'first_name': 'Michael',
                'last_name': 'Brown',
                'password': 'patient123',
                'phone_number': '+1 234 567 8903',
                'address': '789 Pine St, Chicago, IL',
                'date_of_birth': '1982-03-12',
                'blood_group': 'B+'
            },
            {
                'email': 'patient4@example.com',
                'first_name': 'Emily',
                'last_name': 'Davis',
                'password': 'patient123',
                'phone_number': '+1 234 567 8904',
                'address': '101 Maple St, Houston, TX',
                'date_of_birth': '1992-07-25',
                'blood_group': 'AB+'
            },
            {
                'email': 'patient5@example.com',
                'first_name': 'David',
                'last_name': 'Wilson',
                'password': 'patient123',
                'phone_number': '+1 234 567 8905',
                'address': '202 Cedar St, Phoenix, AZ',
                'date_of_birth': '1978-12-05',
                'blood_group': 'O+'
            }
        ]

        for patient_data in patients_data:
            # Create user
            user, created = User.objects.get_or_create(
                email=patient_data['email'],
                defaults={
                    'first_name': patient_data['first_name'],
                    'last_name': patient_data['last_name'],
                    'phone_number': patient_data['phone_number'],
                    'address': patient_data['address'],
                    'user_type': 'patient',
                    'is_active': True
                }
            )

            if created:
                user.set_password(patient_data['password'])
                user.save()

            # Create patient profile
            Patient.objects.get_or_create(
                user=user,
                defaults={
                    # These fields are in the User model, not Patient
                    # 'date_of_birth': datetime.strptime(patient_data['date_of_birth'], '%Y-%m-%d').date(),
                    # 'blood_group': patient_data['blood_group']
                }
            )

            # Update user with date_of_birth and blood_group
            if created:
                user.date_of_birth = datetime.strptime(patient_data['date_of_birth'], '%Y-%m-%d').date()
                user.blood_group = patient_data['blood_group']
                user.save()

        self.stdout.write(f'Created {len(patients_data)} patients')

    def create_appointments(self):
        doctors = Doctor.objects.all()
        patients = Patient.objects.all()

        # Create some past appointments
        for i in range(10):
            doctor = random.choice(doctors)
            patient = random.choice(patients)

            # Random date in the past 30 days
            days_ago = random.randint(1, 30)
            appointment_date = datetime.now().date() - timedelta(days=days_ago)

            # Random time
            hour = random.randint(9, 16)
            minute = random.choice([0, 30])
            appointment_time = time(hour, minute)

            appointment = Appointment.objects.create(
                doctor=doctor,
                patient=patient,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                reason=f"Appointment for {patient.user.first_name}",
                status='completed',
                payment_status='paid'
            )

        # Create some upcoming appointments
        for i in range(5):
            doctor = random.choice(doctors)
            patient = random.choice(patients)

            # Random date in the next 14 days
            days_ahead = random.randint(1, 14)
            appointment_date = datetime.now().date() + timedelta(days=days_ahead)

            # Random time
            hour = random.randint(9, 16)
            minute = random.choice([0, 30])
            appointment_time = time(hour, minute)

            appointment = Appointment.objects.create(
                doctor=doctor,
                patient=patient,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                reason=f"Appointment for {patient.user.first_name}",
                status='confirmed',
                payment_status='paid'
            )

        self.stdout.write(f'Created 15 appointments')

    def create_reviews(self):
        # Get completed appointments
        completed_appointments = Appointment.objects.filter(status='completed')

        for appointment in completed_appointments:
            # 80% chance of having a review
            if random.random() < 0.8:
                rating = random.randint(3, 5)  # Mostly positive reviews

                Review.objects.create(
                    doctor=appointment.doctor,
                    patient=appointment.patient,
                    appointment=appointment,
                    rating=rating,
                    comment=f"Rating: {rating}/5. Good service from Dr. {appointment.doctor.user.last_name}."
                )

        self.stdout.write(f'Created reviews for completed appointments')
