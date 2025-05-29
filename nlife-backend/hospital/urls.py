from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SpecialtyViewSet, DoctorViewSet, PatientViewSet, AppointmentViewSet,
    ReviewViewSet, TimeSlotViewSet, MedicalRecordViewSet
)

router = DefaultRouter()
router.register(r'specialties', SpecialtyViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'time-slots', TimeSlotViewSet)
router.register(r'medical-records', MedicalRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
