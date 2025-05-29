from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'address',
                  'profile_picture', 'user_type', 'gender', 'date_of_birth', 'blood_group', 'date_joined']
        read_only_fields = ['id', 'date_joined']

    def get_profile_picture(self, obj):
        """Return the full URL for profile picture"""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'first_name', 'last_name',
                  'phone_number', 'address', 'gender', 'user_type']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class DoctorRegisterSerializer(RegisterSerializer):
    """Serializer for doctor registration"""

    specialization = serializers.CharField(required=True)
    education = serializers.CharField(required=True)
    experience_years = serializers.IntegerField(required=True)
    bio = serializers.CharField(required=True)
    gender = serializers.ChoiceField(choices=User.GENDER_CHOICES, required=True)
    consultation_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    available_days = serializers.CharField(required=False, allow_blank=True)
    start_time = serializers.TimeField(required=False, allow_null=True)
    end_time = serializers.TimeField(required=False, allow_null=True)
    is_featured = serializers.BooleanField(required=False, default=False)

    class Meta(RegisterSerializer.Meta):
        fields = RegisterSerializer.Meta.fields + [
            'specialization', 'education', 'experience_years', 'bio', 'gender',
            'consultation_fee', 'available_days', 'start_time', 'end_time', 'is_featured'
        ]

    def create(self, validated_data):
        # Extract doctor-specific fields
        specialization = validated_data.pop('specialization', '')
        education = validated_data.pop('education', '')
        experience_years = validated_data.pop('experience_years', 0)
        bio = validated_data.pop('bio', '')

        # Extract additional doctor-specific fields
        consultation_fee = validated_data.pop('consultation_fee', 0)
        available_days = validated_data.pop('available_days', '')
        start_time = validated_data.pop('start_time', None)
        end_time = validated_data.pop('end_time', None)
        is_featured = validated_data.pop('is_featured', False)

        # Set user type
        validated_data['user_type'] = 'doctor'

        # Create user
        user = super().create(validated_data)

        # We don't create the Doctor profile here because it's handled in the view's perform_create method
        return user

class PatientRegisterSerializer(RegisterSerializer):
    """Serializer for patient registration"""

    date_of_birth = serializers.DateField(required=True)
    blood_group = serializers.CharField(required=True)
    gender = serializers.ChoiceField(choices=User.GENDER_CHOICES, required=False)

    class Meta(RegisterSerializer.Meta):
        fields = RegisterSerializer.Meta.fields + ['date_of_birth', 'blood_group', 'gender']

    def create(self, validated_data):
        validated_data['user_type'] = 'patient'

        # Set default gender if not provided
        if 'gender' not in validated_data:
            validated_data['gender'] = 'other'

        return super().create(validated_data)

class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

class UpdateUserSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'address', 'profile_picture', 'email', 'gender', 'date_of_birth', 'blood_group']
