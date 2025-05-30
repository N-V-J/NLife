from rest_framework import serializers
from .models import Specialty, Doctor, Patient, Appointment, TimeSlot, MedicalRecord
from django.contrib.auth import get_user_model

User = get_user_model()

class SpecialtySerializer(serializers.ModelSerializer):
    """Serializer for the Specialty model"""

    class Meta:
        model = Specialty
        fields = '__all__'

class UserBasicSerializer(serializers.ModelSerializer):
    """Basic serializer for User model to be used in nested serializers"""
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture', 'phone_number', 'gender', 'date_of_birth', 'blood_group']

    def get_profile_picture(self, obj):
        """Return the full URL for profile picture"""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for the Doctor model"""

    user = UserBasicSerializer(read_only=True)
    specialty = SpecialtySerializer(read_only=True)
    specialty_id = serializers.PrimaryKeyRelatedField(
        queryset=Specialty.objects.all(),
        source='specialty',
        write_only=True
    )

    class Meta:
        model = Doctor
        fields = '__all__'
        read_only_fields = ['rating', 'total_reviews']

class DoctorListSerializer(serializers.ModelSerializer):
    """Serializer for listing doctors"""

    user = UserBasicSerializer(read_only=True)
    specialty = SpecialtySerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialty', 'experience_years', 'consultation_fee',
                  'is_available', 'is_featured', 'rating', 'total_reviews',
                  'bio', 'education', 'available_days', 'start_time', 'end_time']

class DoctorUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating doctors"""

    # User fields
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    phone_number = serializers.CharField(write_only=True, required=False)
    profile_picture = serializers.ImageField(write_only=True, required=False)

    # Doctor fields
    specialty = serializers.PrimaryKeyRelatedField(
        queryset=Specialty.objects.all(),
        required=False
    )

    class Meta:
        model = Doctor
        fields = [
            'first_name', 'last_name', 'email', 'phone_number', 'profile_picture',
            'specialty', 'bio', 'education', 'experience_years', 'consultation_fee',
            'available_days', 'start_time', 'end_time', 'is_available', 'is_featured'
        ]

    def update(self, instance, validated_data):
        # Extract user fields
        user_fields = {
            'first_name': validated_data.pop('first_name', None),
            'last_name': validated_data.pop('last_name', None),
            'email': validated_data.pop('email', None),
            'phone_number': validated_data.pop('phone_number', None),
            'profile_picture': validated_data.pop('profile_picture', None),
        }

        # Update user fields
        user = instance.user
        for field, value in user_fields.items():
            if value is not None:
                setattr(user, field, value)
        user.save()

        # Update doctor fields
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        return instance

class PatientSerializer(serializers.ModelSerializer):
    """Serializer for the Patient model"""

    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'

class PatientListSerializer(serializers.ModelSerializer):
    """Serializer for listing patients"""

    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'user', 'emergency_contact', 'medical_history', 'allergies', 'date_of_birth', 'blood_group']

class TimeSlotSerializer(serializers.ModelSerializer):
    """Serializer for the TimeSlot model"""

    class Meta:
        model = TimeSlot
        fields = '__all__'

class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments"""

    class Meta:
        model = Appointment
        fields = ['doctor', 'patient', 'appointment_date', 'appointment_time', 'reason']

class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for the Appointment model"""

    doctor = DoctorListSerializer(read_only=True)
    patient = PatientListSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'

class AppointmentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating appointments"""

    class Meta:
        model = Appointment
        fields = ['status', 'payment_status']



class MedicalRecordSerializer(serializers.ModelSerializer):
    """Serializer for the MedicalRecord model"""

    doctor = DoctorListSerializer(read_only=True)
    patient = PatientListSerializer(read_only=True)

    class Meta:
        model = MedicalRecord
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class MedicalRecordCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating medical records"""

    class Meta:
        model = MedicalRecord
        fields = ['patient', 'doctor', 'appointment', 'diagnosis', 'prescription', 'notes']
