from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Specialty, Doctor, Patient, Appointment, Review, TimeSlot, MedicalRecord
from .serializers import (
    SpecialtySerializer, DoctorSerializer, DoctorListSerializer, DoctorUpdateSerializer,
    PatientSerializer, PatientListSerializer, AppointmentSerializer, AppointmentCreateSerializer,
    AppointmentUpdateSerializer, ReviewSerializer, ReviewCreateSerializer,
    TimeSlotSerializer, MedicalRecordSerializer, MedicalRecordCreateSerializer
)

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    def has_permission(self, request, view):
        # Allow authenticated users to access the view
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow admins (both staff and user_type admin)
        if request.user.is_staff or request.user.user_type == 'admin':
            return True

        # Check if the object has a user field directly
        if hasattr(obj, 'user'):
            return obj.user == request.user

        # Check if it's an appointment
        if isinstance(obj, Appointment):
            if request.user.user_type == 'doctor':
                return hasattr(request.user, 'doctor_profile') and obj.doctor.user == request.user
            elif request.user.user_type == 'patient':
                return hasattr(request.user, 'patient_profile') and obj.patient.user == request.user

        return False

class SpecialtyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Specialty model"""

    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    pagination_class = None  # Disable pagination to show all specialties

class DoctorViewSet(viewsets.ModelViewSet):
    """ViewSet for the Doctor model"""

    queryset = Doctor.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'specialty__name', 'bio', 'education']
    pagination_class = None  # Disable pagination to show all doctors

    def get_serializer_class(self):
        if self.action == 'list':
            return DoctorListSerializer
        elif self.action in ['update', 'partial_update']:
            return DoctorUpdateSerializer
        return DoctorSerializer

    def update(self, request, *args, **kwargs):
        """Override update method to check admin permissions"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.user_type == 'admin'):
            return Response(
                {"detail": "You do not have permission to update doctors. Admin access required."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Override partial_update method to check admin permissions"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.user_type == 'admin'):
            return Response(
                {"detail": "You do not have permission to update doctors. Admin access required."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Override destroy method to check admin permissions"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.user_type == 'admin'):
            return Response(
                {"detail": "You do not have permission to delete doctors. Admin access required."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def time_slots(self, request, pk=None):
        doctor = self.get_object()
        time_slots = TimeSlot.objects.filter(doctor=doctor)
        serializer = TimeSlotSerializer(time_slots, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        doctor = self.get_object()
        reviews = Review.objects.filter(doctor=doctor)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def appointments(self, request, pk=None):
        doctor = self.get_object()

        # Only allow the doctor or admin to see appointments
        if not (request.user.is_staff or (hasattr(request.user, 'doctor_profile') and request.user.doctor_profile == doctor)):
            return Response({"detail": "You do not have permission to view these appointments."},
                           status=status.HTTP_403_FORBIDDEN)

        appointments = Appointment.objects.filter(doctor=doctor)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

class PatientViewSet(viewsets.ModelViewSet):
    """ViewSet for the Patient model"""

    queryset = Patient.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email']

    def destroy(self, request, *args, **kwargs):
        """Override destroy method to check admin permissions"""
        # Check if user is admin
        if not (request.user.is_staff or request.user.user_type == 'admin'):
            return Response(
                {"detail": "You do not have permission to delete patients."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Proceed with deletion
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Override update method to check permissions"""
        patient = self.get_object()

        # Allow admin users or the patient themselves
        if not (request.user.is_staff or
                request.user.user_type == 'admin' or
                (hasattr(patient, 'user') and patient.user == request.user)):
            return Response(
                {"detail": "You do not have permission to update this patient."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == 'list':
            return PatientListSerializer
        return PatientSerializer

    @action(detail=True, methods=['get'])
    def appointments(self, request, pk=None):
        patient = self.get_object()

        # Only allow the patient or admin to see appointments
        if not (request.user.is_staff or (hasattr(request.user, 'patient_profile') and request.user.patient_profile == patient)):
            return Response({"detail": "You do not have permission to view these appointments."},
                           status=status.HTTP_403_FORBIDDEN)

        appointments = Appointment.objects.filter(patient=patient)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def medical_records(self, request, pk=None):
        patient = self.get_object()

        # Only allow the patient, their doctor, or admin to see medical records
        if not (request.user.is_staff or
                (hasattr(request.user, 'patient_profile') and request.user.patient_profile == patient) or
                (hasattr(request.user, 'doctor_profile') and MedicalRecord.objects.filter(
                    patient=patient, doctor=request.user.doctor_profile).exists())):
            return Response({"detail": "You do not have permission to view these medical records."},
                           status=status.HTTP_403_FORBIDDEN)

        records = MedicalRecord.objects.filter(patient=patient)
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)

class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Appointment model"""

    queryset = Appointment.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['doctor__user__first_name', 'doctor__user__last_name',
                     'patient__user__first_name', 'patient__user__last_name']

    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppointmentUpdateSerializer
        return AppointmentSerializer

    @action(detail=False, methods=['get'])
    def my_appointments(self, request):
        print(f"=== MY_APPOINTMENTS ENDPOINT CALLED ===")
        print(f"User: {request.user}")
        print(f"User authenticated: {request.user.is_authenticated}")
        print(f"User type: {getattr(request.user, 'user_type', 'No user_type')}")
        print(f"User email: {request.user.email}")

        user = request.user

        try:
            if user.user_type == 'doctor':
                # Try to get doctor profile
                from hospital.models import Doctor
                try:
                    doctor_profile = user.doctor_profile
                    print(f"Doctor profile found: ID={doctor_profile.id}, User={doctor_profile.user.email}")
                except Doctor.DoesNotExist:
                    print(f"Doctor profile not found for user {user.email}")
                    return Response({"detail": "Doctor profile not found. Please contact admin."}, status=status.HTTP_404_NOT_FOUND)

                # Filter appointments specifically for this doctor
                appointments = Appointment.objects.filter(doctor=doctor_profile).order_by('-created_at')
                print(f"Found {appointments.count()} appointments for doctor {user.email} (Doctor ID: {doctor_profile.id})")

                # Debug: Show which appointments are being returned
                for apt in appointments:
                    print(f"  - Appointment ID: {apt.id}, Patient: {apt.patient.user.email}, Doctor: {apt.doctor.user.first_name} {apt.doctor.user.last_name}, Date: {apt.appointment_date}")

            elif user.user_type == 'patient':
                # Try to get patient profile
                from hospital.models import Patient
                try:
                    patient_profile = user.patient_profile
                    print(f"Patient profile found: ID={patient_profile.id}, User={patient_profile.user.email}")
                except Patient.DoesNotExist:
                    print(f"Patient profile not found for user {user.email}")
                    return Response({"detail": "Patient profile not found. Please contact admin."}, status=status.HTTP_404_NOT_FOUND)

                # Filter appointments specifically for this patient ONLY
                appointments = Appointment.objects.filter(patient=patient_profile).order_by('-created_at')
                print(f"Found {appointments.count()} appointments for patient {user.email} (Patient ID: {patient_profile.id})")

                # Debug: Show which appointments are being returned
                for apt in appointments:
                    print(f"  - Appointment ID: {apt.id}, Patient: {apt.patient.user.email}, Doctor: {apt.doctor.user.first_name} {apt.doctor.user.last_name}, Date: {apt.appointment_date}")

                # Additional verification: Ensure all returned appointments belong to this patient
                for apt in appointments:
                    if apt.patient.id != patient_profile.id:
                        print(f"ERROR: Found appointment {apt.id} that doesn't belong to patient {patient_profile.id}")

            elif user.user_type == 'admin' or user.is_staff:
                # Admin users can see all appointments
                appointments = Appointment.objects.all().order_by('-created_at')
                print(f"Found {appointments.count()} appointments for admin")

            else:
                print(f"Invalid user type: {getattr(user, 'user_type', 'None')}")
                return Response({"detail": "Invalid user type. Please contact admin."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = AppointmentSerializer(appointments, many=True)
            print(f"Returning {len(serializer.data)} appointments")

            # Additional debug: Show serialized data for patients
            if user.user_type == 'patient':
                print("=== SERIALIZED APPOINTMENT DATA ===")
                for apt_data in serializer.data:
                    patient_email = apt_data.get('patient', {}).get('user', {}).get('email', 'Unknown')
                    print(f"  - Appointment ID: {apt_data.get('id')}, Patient Email: {patient_email}")

            return Response(serializer.data)

        except Exception as e:
            print(f"Error in my_appointments: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return Response({"detail": "An error occurred while fetching appointments."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def all_appointments(self, request):
        """Public endpoint to show all appointments for demonstration"""
        print(f"=== ALL_APPOINTMENTS ENDPOINT CALLED ===")

        # Get all appointments
        appointments = Appointment.objects.all().order_by('-created_at')
        print(f"Found {appointments.count()} total appointments")

        serializer = AppointmentSerializer(appointments, many=True)
        print(f"Returning {len(serializer.data)} appointments")
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for the Review model"""

    queryset = Review.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer

class TimeSlotViewSet(viewsets.ModelViewSet):
    """ViewSet for the TimeSlot model"""

    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        doctor_id = self.request.query_params.get('doctor', None)
        day = self.request.query_params.get('day', None)

        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if day:
            queryset = queryset.filter(day_of_week=day)

        return queryset

class MedicalRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for the MedicalRecord model"""

    queryset = MedicalRecord.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return MedicalRecordCreateSerializer
        return MedicalRecordSerializer
