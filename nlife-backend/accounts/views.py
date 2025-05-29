from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, RegisterSerializer, DoctorRegisterSerializer,
    PatientRegisterSerializer, ChangePasswordSerializer, UpdateUserSerializer
)
from hospital.models import Doctor, Patient

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """View for user registration"""

    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class DoctorRegisterView(generics.CreateAPIView):
    """View for doctor registration"""

    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DoctorRegisterSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        user = serializer.save()
        print(f"User created: {user.id} - {user.email}")

        try:
            # Get or create specialty
            from hospital.models import Specialty
            specialization_name = serializer.validated_data.get('specialization', '')
            print(f"Specialization: {specialization_name}")

            specialty, created = Specialty.objects.get_or_create(name=specialization_name)
            print(f"Specialty created/found: {specialty.id} - {specialty.name}")

            # Get additional fields
            education = serializer.validated_data.get('education', '')
            experience_years = serializer.validated_data.get('experience_years', 0)
            bio = serializer.validated_data.get('bio', '')

            # Get consultation fee, available days, start time, and end time if available
            consultation_fee = serializer.validated_data.get('consultation_fee', 0)
            available_days = serializer.validated_data.get('available_days', '')

            # Handle time fields
            start_time_str = serializer.validated_data.get('start_time', None)
            end_time_str = serializer.validated_data.get('end_time', None)

            # Convert time strings to time objects if needed
            from datetime import datetime
            start_time = None
            end_time = None

            if start_time_str:
                if isinstance(start_time_str, str):
                    try:
                        start_time = datetime.strptime(start_time_str, '%H:%M').time()
                    except ValueError:
                        print(f"Invalid start time format: {start_time_str}")
                else:
                    start_time = start_time_str

            if end_time_str:
                if isinstance(end_time_str, str):
                    try:
                        end_time = datetime.strptime(end_time_str, '%H:%M').time()
                    except ValueError:
                        print(f"Invalid end time format: {end_time_str}")
                else:
                    end_time = end_time_str

            # Handle boolean field
            is_featured_val = serializer.validated_data.get('is_featured', False)
            is_featured = is_featured_val in [True, 'true', 'True', '1', 1]

            print(f"Doctor fields: education={education}, experience_years={experience_years}, bio={bio}")
            print(f"Doctor fields: consultation_fee={consultation_fee}, available_days={available_days}")
            print(f"Doctor fields: start_time={start_time}, end_time={end_time}, is_featured={is_featured}")

            # Create doctor profile
            doctor = Doctor.objects.create(
                user=user,
                specialty=specialty,
                education=education,
                experience_years=experience_years,
                bio=bio,
                consultation_fee=consultation_fee,
                available_days=available_days,
                start_time=start_time,
                end_time=end_time,
                is_featured=is_featured
            )
            print(f"Doctor created: {doctor.id}")
        except Exception as e:
            print(f"Error creating doctor: {str(e)}")
            import traceback
            print(traceback.format_exc())

    def create(self, request, *args, **kwargs):
        # Handle profile picture upload
        profile_picture = request.FILES.get('profile_picture')

        # Create a mutable copy of the data
        data = request.data.copy()

        # Create the serializer with all the data
        serializer = self.get_serializer(data=data)

        # Validate the serializer
        if serializer.is_valid():
            # Create the user
            user = serializer.save()
            print(f"User created: {user.id} - {user.email}")

            # Update the user with the profile picture if provided
            if profile_picture:
                user.profile_picture = profile_picture
                user.save()

            try:
                # Get or create specialty
                from hospital.models import Specialty
                specialization_name = serializer.validated_data.get('specialization', '')
                print(f"Specialization: {specialization_name}")

                specialty, created = Specialty.objects.get_or_create(name=specialization_name)
                print(f"Specialty created/found: {specialty.id} - {specialty.name}")

                # Get additional fields
                education = serializer.validated_data.get('education', '')
                experience_years = serializer.validated_data.get('experience_years', 0)
                bio = serializer.validated_data.get('bio', '')

                # Handle time fields
                start_time_str = serializer.validated_data.get('start_time', None)
                end_time_str = serializer.validated_data.get('end_time', None)

                # Convert time strings to time objects if needed
                from datetime import datetime
                start_time = None
                end_time = None

                if start_time_str:
                    if isinstance(start_time_str, str):
                        try:
                            start_time = datetime.strptime(start_time_str, '%H:%M').time()
                        except ValueError:
                            print(f"Invalid start time format: {start_time_str}")
                    else:
                        start_time = start_time_str

                if end_time_str:
                    if isinstance(end_time_str, str):
                        try:
                            end_time = datetime.strptime(end_time_str, '%H:%M').time()
                        except ValueError:
                            print(f"Invalid end time format: {end_time_str}")
                    else:
                        end_time = end_time_str

                # Handle boolean field
                is_featured_val = serializer.validated_data.get('is_featured', False)
                is_featured = is_featured_val in [True, 'true', 'True', '1', 1]

                # Handle consultation fee
                consultation_fee = serializer.validated_data.get('consultation_fee', 0)
                if isinstance(consultation_fee, str):
                    try:
                        consultation_fee = float(consultation_fee)
                    except ValueError:
                        print(f"Invalid consultation fee format: {consultation_fee}")
                        consultation_fee = 0

                # Handle available days
                available_days = serializer.validated_data.get('available_days', '')

                print(f"Doctor fields: education={education}, experience_years={experience_years}, bio={bio}")
                print(f"Doctor fields: consultation_fee={consultation_fee}, available_days={available_days}")
                print(f"Doctor fields: start_time={start_time}, end_time={end_time}, is_featured={is_featured}")

                # Create doctor profile
                from hospital.models import Doctor
                doctor = Doctor.objects.create(
                    user=user,
                    specialty=specialty,
                    education=education,
                    experience_years=experience_years,
                    bio=bio,
                    consultation_fee=consultation_fee,
                    available_days=available_days,
                    start_time=start_time,
                    end_time=end_time,
                    is_featured=is_featured
                )
                print(f"Doctor created: {doctor.id}")
            except Exception as e:
                print(f"Error creating doctor: {str(e)}")
                import traceback
                print(traceback.format_exc())
                # Don't return an error, just log it
                # The user is still created, which is better than nothing

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientRegisterView(generics.CreateAPIView):
    """View for patient registration"""

    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PatientRegisterSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def perform_create(self, serializer):
        user = serializer.save()
        # Create patient profile
        Patient.objects.create(
            user=user,
            date_of_birth=serializer.validated_data.get('date_of_birth', None),
            blood_group=serializer.validated_data.get('blood_group', '')
        )

    def create(self, request, *args, **kwargs):
        print(f"=== PATIENT REGISTRATION ENDPOINT CALLED ===")
        print(f"Content-Type: {request.content_type}")
        print(f"Request data: {request.data}")
        print(f"Request method: {request.method}")

        # Handle profile picture upload (only for multipart requests)
        profile_picture = request.FILES.get('profile_picture') if hasattr(request, 'FILES') else None

        # Create a mutable copy of the data
        if hasattr(request.data, 'copy'):
            data = request.data.copy()
        else:
            # For JSON data, create a new dict
            data = dict(request.data)

        print(f"Processed data: {data}")

        # Create the user and patient profile
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid, creating user...")
            self.perform_create(serializer)
            print(f"User created: {serializer.instance}")

            # Update the user with the profile picture if provided
            if profile_picture:
                user = serializer.instance
                user.profile_picture = profile_picture
                user.save()

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveAPIView):
    """View for retrieving user details"""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UpdateUserView(generics.UpdateAPIView):
    """View for updating user profile"""

    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Handle profile picture upload
        profile_picture = request.FILES.get('profile_picture')

        # Get the user object
        user = self.get_object()

        # Create a mutable copy of the data
        data = request.data.copy()

        # Update the user
        serializer = self.get_serializer(user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Update the profile picture if provided
        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

        return Response(serializer.data)

class ChangePasswordView(generics.UpdateAPIView):
    """View for changing password"""

    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUpdateUserView(generics.UpdateAPIView):
    """View for admin to update any user profile"""

    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_permissions(self):
        """Only allow staff/admin users to update other users"""
        if self.request.user.is_staff or self.request.user.user_type == 'admin':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), permissions.IsAdminUser()]

    def update(self, request, *args, **kwargs):
        # Get the user object
        user = self.get_object()

        # Create a mutable copy of the data
        data = request.data.copy()

        # Update the user
        serializer = self.get_serializer(user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)