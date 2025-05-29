from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a superuser automatically with predefined credentials'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='admin@nlife.com',
            help='Email for the superuser (default: admin@nlife.com)'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='admin123',
            help='Password for the superuser (default: admin123)'
        )
        parser.add_argument(
            '--first-name',
            type=str,
            default='Admin',
            help='First name for the superuser (default: Admin)'
        )
        parser.add_argument(
            '--last-name',
            type=str,
            default='User',
            help='Last name for the superuser (default: User)'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force creation even if user exists (will update existing user)'
        )

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        first_name = options['first_name']
        last_name = options['last_name']
        force = options['force']

        try:
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                if force:
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
                        self.style.SUCCESS(
                            f'Successfully updated existing user "{email}" to superuser'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'User with email "{email}" already exists. '
                            'Use --force to update existing user.'
                        )
                    )
                    return

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
                    self.style.SUCCESS(
                        f'Successfully created superuser "{email}"'
                    )
                )

            # Display user information
            self.stdout.write(
                self.style.SUCCESS(
                    f'\nSuperuser Details:\n'
                    f'Email: {user.email}\n'
                    f'Name: {user.first_name} {user.last_name}\n'
                    f'User Type: {user.user_type}\n'
                    f'Is Staff: {user.is_staff}\n'
                    f'Is Superuser: {user.is_superuser}\n'
                    f'Is Active: {user.is_active}'
                )
            )

        except IntegrityError as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Error creating superuser: {str(e)}'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Unexpected error: {str(e)}'
                )
            )
