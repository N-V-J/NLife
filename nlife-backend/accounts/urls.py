from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, PatientRegisterView,
    UserDetailView, UpdateUserView, ChangePasswordView, AdminUpdateUserView
)
from .views_doctor import DoctorRegisterAPIView
from .views_admin import create_superuser_api

urlpatterns = [
    # Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Registration endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('register/doctor/', DoctorRegisterAPIView.as_view(), name='register_doctor'),
    path('register/patient/', PatientRegisterView.as_view(), name='register_patient'),

    # User profile endpoints
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('me/update/', UpdateUserView.as_view(), name='update_user'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Admin endpoints
    path('users/<int:pk>/update/', AdminUpdateUserView.as_view(), name='admin_update_user'),

    # Setup endpoints (for deployment)
    path('setup/create-superuser/', create_superuser_api, name='create_superuser_api'),
]
