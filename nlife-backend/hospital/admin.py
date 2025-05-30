from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import Specialty, Doctor, Patient, Appointment, TimeSlot, MedicalRecord

class DoctorAdminForm(forms.ModelForm):
    """Custom form for Doctor admin to include profile picture field from User model"""
    profile_picture = forms.ImageField(required=False, label='Profile Picture')

    class Meta:
        model = Doctor
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If we're editing an existing doctor, populate the profile picture field
        if self.instance and self.instance.pk and self.instance.user:
            self.initial['profile_picture'] = self.instance.user.profile_picture

    def save(self, commit=True):
        doctor = super().save(commit=False)

        # Save the profile picture to the user model
        if 'profile_picture' in self.cleaned_data and self.cleaned_data['profile_picture']:
            doctor.user.profile_picture = self.cleaned_data['profile_picture']
            doctor.user.save()

        if commit:
            doctor.save()

        return doctor

@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name', 'description')

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    form = DoctorAdminForm
    list_display = ('profile_picture_display', '__str__', 'specialty', 'experience_years', 'consultation_fee', 'is_available', 'is_featured')
    list_filter = ('specialty', 'is_available', 'is_featured')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'bio', 'education')

    def profile_picture_display(self, obj):
        """Display the profile picture as a thumbnail in the admin list view"""
        if obj.user and obj.user.profile_picture:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.user.profile_picture.url)
        return format_html('<span>No Image</span>')
    profile_picture_display.short_description = 'Profile Picture'

    fieldsets = (
        (None, {'fields': ('user', 'specialty', 'profile_picture')}),
        ('Professional Details', {'fields': ('bio', 'education', 'experience_years', 'consultation_fee')}),
        ('Availability', {'fields': ('available_days', 'start_time', 'end_time', 'is_available')}),
        ('Additional Info', {'fields': ('is_featured',)}),
    )

class PatientAdminForm(forms.ModelForm):
    """Custom form for Patient admin to include profile picture field from User model"""
    profile_picture = forms.ImageField(required=False, label='Profile Picture')

    class Meta:
        model = Patient
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If we're editing an existing patient, populate the profile picture field
        if self.instance and self.instance.pk and self.instance.user:
            self.initial['profile_picture'] = self.instance.user.profile_picture

    def save(self, commit=True):
        patient = super().save(commit=False)

        # Save the profile picture to the user model
        if 'profile_picture' in self.cleaned_data and self.cleaned_data['profile_picture']:
            patient.user.profile_picture = self.cleaned_data['profile_picture']
            patient.user.save()

        if commit:
            patient.save()

        return patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    form = PatientAdminForm
    list_display = ('profile_picture_display', '__str__', 'user', 'emergency_contact')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'medical_history')

    def profile_picture_display(self, obj):
        """Display the profile picture as a thumbnail in the admin list view"""
        if obj.user and obj.user.profile_picture:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.user.profile_picture.url)
        return format_html('<span>No Image</span>')
    profile_picture_display.short_description = 'Profile Picture'

    fieldsets = (
        (None, {'fields': ('user', 'profile_picture')}),
        ('Medical Information', {'fields': ('emergency_contact', 'medical_history', 'allergies', 'date_of_birth', 'blood_group')}),
    )

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'patient', 'appointment_date', 'appointment_time', 'status', 'payment_status')
    list_filter = ('status', 'payment_status', 'appointment_date')
    search_fields = ('doctor__user__first_name', 'doctor__user__last_name', 'patient__user__first_name', 'patient__user__last_name')
    date_hierarchy = 'appointment_date'



@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'day_of_week', 'start_time', 'end_time', 'is_available')
    list_filter = ('day_of_week', 'is_available')
    search_fields = ('doctor__user__first_name', 'doctor__user__last_name')

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('patient__user__first_name', 'patient__user__last_name', 'doctor__user__first_name', 'doctor__user__last_name', 'diagnosis', 'prescription')
