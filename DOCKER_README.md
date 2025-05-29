# NLife Docker Deployment Guide

This guide explains how to deploy the NLife Hospital Management System using Docker containers.

## 🏗️ Architecture

The application consists of 4 main services:

- **Frontend** (React + Vite + Nginx) - Port 3000/5173
- **Backend** (Django + Gunicorn) - Port 8000
- **Database** (PostgreSQL) - Port 5432
- **Cache** (Redis) - Port 6379

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- At least 4GB RAM available
- At least 10GB disk space

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd NLife
```

### 2. Test Docker Setup (Optional but Recommended)
```bash
# Linux/Mac
./scripts/test-docker.sh

# Windows - check manually:
# - Docker Desktop is running
# - Ports 3000, 8000, 5432 are available
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.development .env

# Edit environment variables (optional)
nano .env  # or use your preferred editor
```

### 4. Deploy

**For Development (with hot reload):**
```bash
# Linux/Mac
./scripts/deploy.sh dev

# Windows
scripts\deploy.bat dev

# Manual (any OS)
docker-compose -f docker-compose.dev.yml up -d
```

**For Production:**
```bash
# Linux/Mac
./scripts/deploy.sh prod

# Windows
scripts\deploy.bat prod

# Manual (any OS)
docker-compose up -d
```

## 🌐 Access URLs

After deployment, access the application at:

- **Frontend**: http://localhost:3000 (prod) or http://localhost:5173 (dev)
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/swagger/
- **Database**: localhost:5432 (internal access only)

## 🔑 Default Credentials

**Admin User:**
- Email: `admin@nlife.com`
- Password: `admin123`

**Database:**
- Username: `postgres`
- Password: `nlife_dev_password` (development)
- Database: `nlife_db`

## 📁 Project Structure

```
NLife/
├── docker-compose.yml              # Production configuration
├── docker-compose.dev.yml          # Development configuration
├── .env.development                # Development environment
├── .env.example                    # Environment template
├── nlife-backend/
│   ├── Dockerfile                  # Production backend image
│   ├── Dockerfile.dev              # Development backend image
│   └── requirements.txt            # Python dependencies
├── nlife-frontend/
│   ├── Dockerfile                  # Production frontend image
│   ├── Dockerfile.dev              # Development frontend image
│   ├── nginx.conf                  # Nginx configuration
│   └── package.json                # Node.js dependencies
└── scripts/
    ├── deploy.sh                   # Linux/Mac deployment script
    ├── deploy.bat                  # Windows deployment script
    └── init-db.sql                 # Database initialization
```

## 🛠️ Management Commands

### Start Services
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Restart Services
```bash
# Linux/Mac
./scripts/deploy.sh restart [dev]

# Windows
scripts\deploy.bat restart [dev]
```

### Database Operations
```bash
# Access database shell
docker-compose exec db psql -U postgres -d nlife_db

# Create database backup
docker-compose exec db pg_dump -U postgres nlife_db > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres nlife_db < backup.sql
```

### Django Management
```bash
# Run Django commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic
docker-compose exec backend python manage.py createsuperuser

# Access Django shell
docker-compose exec backend python manage.py shell
```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```env
# Database
POSTGRES_DB=nlife_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=db

# Django
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Production Considerations

1. **Security:**
   - Change default passwords
   - Use strong SECRET_KEY
   - Set DEBUG=False
   - Configure proper ALLOWED_HOSTS

2. **Performance:**
   - Use external PostgreSQL for production
   - Configure Redis for caching
   - Set up proper logging

3. **Monitoring:**
   - Health checks are configured
   - Use `docker-compose ps` to check status
   - Monitor logs regularly

## 🐛 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check Docker status
docker info

# Check logs
docker-compose logs

# Rebuild containers
docker-compose build --no-cache
```

**Database connection errors:**
```bash
# Check database status
docker-compose exec db pg_isready -U postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

**Port conflicts:**
```bash
# Check what's using ports
netstat -tulpn | grep :8000
netstat -tulpn | grep :3000

# Stop conflicting services or change ports in docker-compose.yml
```

**Permission errors:**
```bash
# Fix file permissions (Linux/Mac)
sudo chown -R $USER:$USER .
chmod +x scripts/deploy.sh
```

### Health Checks

Check service health:
```bash
# Backend health
curl http://localhost:8000/api/health/

# Frontend health
curl http://localhost:3000/

# Database health
docker-compose exec db pg_isready -U postgres
```

## 🐳 DockerHub Deployment

### Pushing Images to DockerHub

To build and push the NLife images to DockerHub:

```bash
# Set your DockerHub username
export DOCKERHUB_USERNAME=your-dockerhub-username

# Linux/Mac - Push all images
./scripts/push-to-dockerhub.sh

# Windows - Push all images
scripts\push-to-dockerhub.bat

# Push specific components
./scripts/push-to-dockerhub.sh backend
./scripts/push-to-dockerhub.sh frontend

# Build with version tag
VERSION=v1.0.0 ./scripts/push-to-dockerhub.sh
```

### Running from DockerHub Images

To run NLife using pre-built images from DockerHub:

```bash
# Set your DockerHub username and version
export DOCKERHUB_USERNAME=your-dockerhub-username
export VERSION=latest

# Run with DockerHub images
docker-compose -f docker-compose.dockerhub.yml up -d

# Or manually pull and run
docker pull $DOCKERHUB_USERNAME/nlife-backend:latest
docker pull $DOCKERHUB_USERNAME/nlife-frontend:latest
```

### DockerHub Image Information

**Backend Image Features:**
- Python 3.11 slim base
- Django + Gunicorn
- PostgreSQL client
- Health checks included
- Non-root user for security

**Frontend Image Features:**
- Multi-stage build (Node.js + Nginx)
- Optimized production build
- Custom Nginx configuration
- Health checks included

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Django Deployment](https://docs.djangoproject.com/en/4.2/howto/deployment/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [DockerHub Documentation](https://docs.docker.com/docker-hub/)

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all ports are available
4. Try rebuilding: `docker-compose build --no-cache`
5. Reset everything: `docker-compose down -v && docker-compose up -d`
