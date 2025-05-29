from django.db import models
from django.conf import settings
from django.utils import timezone

class Specialty(models.Model):
    """Medical specialties for doctors"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='specialty_icons/', blank=True, null=True)

    class Meta:
        verbose_name_plural = "Specialties"

    def __str__(self):
        return self.name

class Doctor(models.Model):
    """Doctor model extending the User model"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.ForeignKey(Specialty, on_delete=models.SET_NULL, null=True, related_name='doctors')
    bio = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    experience_years = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    available_days = models.CharField(max_length=100, blank=True, null=True, help_text="Comma separated days, e.g., 'Monday,Tuesday,Wednesday'")
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name}"

class Patient(models.Model):
    """Patient model extending the User model"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile')
    emergency_contact = models.CharField(max_length=15, blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    blood_group = models.CharField(max_length=5, blank=True, null=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Appointment(models.Model):
    """Appointment model for booking doctor appointments"""
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.TextField(blank=True, null=True)

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    PAYMENT_STATUS_CHOICES = (
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    )
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='unpaid')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor} - {self.appointment_date}"

class Review(models.Model):
    """Review model for doctor reviews"""
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='reviews')
    appointment = models.OneToOneField(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='review')
    rating = models.PositiveIntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor} - {self.rating}"

    def save(self, *args, **kwargs):
        """Update doctor's rating when a review is saved"""
        super().save(*args, **kwargs)
        # Update doctor's rating
        doctor = self.doctor
        reviews = doctor.reviews.all()
        total_rating = sum(review.rating for review in reviews)
        doctor.total_reviews = len(reviews)
        doctor.rating = total_rating / doctor.total_reviews if doctor.total_reviews > 0 else 0
        doctor.save()

class TimeSlot(models.Model):
    """Time slots for doctor availability"""
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='time_slots')
    day_of_week = models.CharField(max_length=10, choices=[
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.doctor} - {self.day_of_week} - {self.start_time} to {self.end_time}"

class MedicalRecord(models.Model):
    """Medical records for patients"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='medical_records')
    appointment = models.OneToOneField(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='medical_record')
    diagnosis = models.TextField()
    prescription = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor} - {self.created_at.date()}"
