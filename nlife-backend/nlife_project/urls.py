"""
URL configuration for nlife_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def health_check(request):
    """Health check endpoint for Docker"""
    return JsonResponse({'status': 'healthy', 'service': 'nlife-backend'})

schema_view = get_schema_view(
    openapi.Info(
        title="NLife Hospital API",
        default_version='v1',
        description="API for NLife Hospital Booking System",
        terms_of_service="https://www.nlife.com/terms/",
        contact=openapi.Contact(email="contact@nlife.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Health check
    path('api/health/', health_check, name='health-check'),

    # Admin
    path('admin/', admin.site.urls),

    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/', include('hospital.urls')),
]

# Serve media files in both development and production
# This is necessary for profile pictures and other uploaded files to work
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Also serve static files if needed (though WhiteNoise handles this)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
