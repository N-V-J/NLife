# NLife Hospital Booking System Backend

This is the backend API for the NLife Hospital Booking System, built with Django and Django REST Framework.

## Features

- User authentication with JWT tokens
- Role-based access control (Admin, Doctor, Patient)
- Doctor and specialty management
- Appointment scheduling and management
- Patient medical records
- Doctor reviews and ratings
- Time slot management for doctor availability

## Tech Stack

- Django 4.2+
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI Documentation

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nlife-backend
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Configure the database in `nlife_project/settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'NLife_db',
           'USER': 'postgres',
           'PASSWORD': '1872',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

5. Apply migrations:
   ```
   python manage.py migrate
   ```

6. Create a superuser:

   **Option A: Automated Superuser Creation (Recommended)**
   ```
   python create_superuser.py
   ```
   This creates a superuser with:
   - Email: admin@nlife.com
   - Password: admin123

   **Option B: Using Django Management Command**
   ```
   python manage.py create_superuser_auto
   ```

   **Option C: Manual Creation**
   ```
   python manage.py createsuperuser
   ```

   For more details, see [SUPERUSER_SETUP.md](SUPERUSER_SETUP.md)

7. Populate the database with sample data (optional):
   ```
   python manage.py populate_db
   ```

8. Run the development server:
   ```
   python manage.py runserver
   ```

## API Documentation

The API documentation is available at:
- Swagger UI: `/swagger/`
- ReDoc: `/redoc/`

## API Endpoints

### Authentication

- `POST /api/auth/token/`: Get JWT token
- `POST /api/auth/token/refresh/`: Refresh JWT token
- `POST /api/auth/register/`: Register a new user
- `POST /api/auth/register/doctor/`: Register a new doctor
- `POST /api/auth/register/patient/`: Register a new patient

### User Management

- `GET /api/auth/me/`: Get current user details
- `PUT /api/auth/me/update/`: Update user profile
- `POST /api/auth/me/change-password/`: Change password

### Specialties

- `GET /api/specialties/`: List all specialties
- `POST /api/specialties/`: Create a new specialty (admin only)
- `GET /api/specialties/{id}/`: Get specialty details
- `PUT /api/specialties/{id}/`: Update a specialty (admin only)
- `DELETE /api/specialties/{id}/`: Delete a specialty (admin only)

### Doctors

- `GET /api/doctors/`: List all doctors
- `POST /api/doctors/`: Create a new doctor (admin only)
- `GET /api/doctors/{id}/`: Get doctor details
- `PUT /api/doctors/{id}/`: Update a doctor
- `DELETE /api/doctors/{id}/`: Delete a doctor (admin only)
- `GET /api/doctors/{id}/time-slots/`: Get doctor's time slots
- `GET /api/doctors/{id}/reviews/`: Get doctor's reviews
- `GET /api/doctors/{id}/appointments/`: Get doctor's appointments

### Patients

- `GET /api/patients/`: List all patients (admin only)
- `GET /api/patients/{id}/`: Get patient details
- `PUT /api/patients/{id}/`: Update a patient
- `DELETE /api/patients/{id}/`: Delete a patient (admin only)
- `GET /api/patients/{id}/appointments/`: Get patient's appointments
- `GET /api/patients/{id}/medical-records/`: Get patient's medical records

### Appointments

- `GET /api/appointments/`: List all appointments
- `POST /api/appointments/`: Create a new appointment
- `GET /api/appointments/{id}/`: Get appointment details
- `PUT /api/appointments/{id}/`: Update an appointment
- `DELETE /api/appointments/{id}/`: Delete an appointment
- `GET /api/appointments/my-appointments/`: Get current user's appointments

### Reviews

- `GET /api/reviews/`: List all reviews
- `POST /api/reviews/`: Create a new review
- `GET /api/reviews/{id}/`: Get review details
- `PUT /api/reviews/{id}/`: Update a review
- `DELETE /api/reviews/{id}/`: Delete a review

### Time Slots

- `GET /api/time-slots/`: List all time slots
- `POST /api/time-slots/`: Create a new time slot
- `GET /api/time-slots/{id}/`: Get time slot details
- `PUT /api/time-slots/{id}/`: Update a time slot
- `DELETE /api/time-slots/{id}/`: Delete a time slot

### Medical Records

- `GET /api/medical-records/`: List all medical records
- `POST /api/medical-records/`: Create a new medical record
- `GET /api/medical-records/{id}/`: Get medical record details
- `PUT /api/medical-records/{id}/`: Update a medical record
- `DELETE /api/medical-records/{id}/`: Delete a medical record

## License

This project is licensed under the MIT License.
