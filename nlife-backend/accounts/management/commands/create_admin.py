from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser for NLife application'

    def handle(self, *args, **options):
        email = 'admin@nlife.com'
        password = 'admin123'
        first_name = 'Admin'
        last_name = 'User'
        
        self.stdout.write('Creating superuser...')
        
        try:
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
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully updated existing user "{email}" to superuser')
                )
            else:
                # Create new superuser
                user = User.objects.create_superuser(
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    user_type='admin'
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created superuser "{email}"')
                )
                
            self.stdout.write(f'Email: {email}')
            self.stdout.write(f'Password: {password}')
            self.stdout.write('You can now login to Django admin!')
            
        except IntegrityError as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {str(e)}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Unexpected error: {str(e)}')
            )
