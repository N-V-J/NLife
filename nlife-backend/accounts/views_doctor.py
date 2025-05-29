from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from hospital.models import Doctor, Specialty
from datetime import datetime

User = get_user_model()

class DoctorRegisterAPIView(APIView):
    """API view for doctor registration"""

    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        # Extract user fields
        user_data = {
            'email': request.data.get('email'),
            'password': request.data.get('password'),
            'password2': request.data.get('password2'),
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'phone_number': request.data.get('phone_number', ''),
            'address': request.data.get('address', ''),
            'gender': request.data.get('gender'),
            'user_type': 'doctor'
        }

        # Validate user data
        user_serializer = RegisterSerializer(data=user_data)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        user = user_serializer.save()

        # Handle profile picture
        profile_picture = request.FILES.get('profile_picture')
        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

        try:
            # Get or create specialty
            specialization_name = request.data.get('specialization', '')
            specialty, created = Specialty.objects.get_or_create(name=specialization_name)

            # Get doctor fields
            education = request.data.get('education', '')
            experience_years = request.data.get('experience_years', 0)
            if isinstance(experience_years, str):
                try:
                    experience_years = int(experience_years)
                except ValueError:
                    experience_years = 0

            bio = request.data.get('bio', '')

            # Handle time fields
            start_time_str = request.data.get('start_time', None)
            end_time_str = request.data.get('end_time', None)

            start_time = None
            end_time = None

            if start_time_str:
                try:
                    start_time = datetime.strptime(start_time_str, '%H:%M').time()
                except ValueError:
                    pass

            if end_time_str:
                try:
                    end_time = datetime.strptime(end_time_str, '%H:%M').time()
                except ValueError:
                    pass

            # Handle boolean field
            is_featured_val = request.data.get('is_featured', False)
            is_featured = is_featured_val in [True, 'true', 'True', '1', 1]

            # Handle consultation fee
            consultation_fee = request.data.get('consultation_fee', 0)
            if isinstance(consultation_fee, str):
                try:
                    consultation_fee = float(consultation_fee)
                except ValueError:
                    consultation_fee = 0

            # Handle available days
            available_days = request.data.get('available_days', '')

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

            return Response({
                'status': 'success',
                'message': 'Doctor registered successfully',
                'user_id': user.id,
                'doctor_id': doctor.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # If doctor creation fails, delete the user
            user.delete()
            print(f"Error creating doctor: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
