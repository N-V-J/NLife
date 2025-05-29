from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def create_superuser_api(request):
    """
    API endpoint to create superuser - for deployment purposes only
    This should be removed in production or secured properly
    """
    try:
        data = json.loads(request.body)
        secret_key = data.get('secret_key')
        
        # Simple security check - you can change this secret
        if secret_key != 'nlife_admin_setup_2024':
            return JsonResponse({
                'error': 'Invalid secret key'
            }, status=403)
        
        email = 'admin@nlife.com'
        password = 'admin123'
        first_name = 'Admin'
        last_name = 'User'
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.first_name = first_name
            user.last_name = last_name
            user.user_type = 'admin'
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Successfully updated existing user "{email}" to superuser',
                'email': email,
                'password': password
            })
        else:
            # Create new superuser
            user = User.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                user_type='admin'
            )
            
            return JsonResponse({
                'success': True,
                'message': f'Successfully created superuser "{email}"',
                'email': email,
                'password': password
            })
            
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'Error creating superuser: {str(e)}'
        }, status=500)
