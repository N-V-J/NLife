# NLife DockerHub Deployment Guide

This guide explains how to build and push the NLife Hospital Management System images to DockerHub.

## 🐳 Prerequisites

- Docker Desktop installed and running
- DockerHub account
- Git repository cloned locally

## 🚀 Quick Start

### 1. Login to DockerHub

```bash
docker login
```

### 2. Set Environment Variables

**Linux/Mac:**
```bash
export DOCKERHUB_USERNAME=your-dockerhub-username
export VERSION=v1.0.0  # Optional, defaults to 'latest'
```

**Windows (PowerShell):**
```powershell
$env:DOCKERHUB_USERNAME="your-dockerhub-username"
$env:VERSION="v1.0.0"  # Optional, defaults to 'latest'
```

**Windows (Command Prompt):**
```cmd
set DOCKERHUB_USERNAME=your-dockerhub-username
set VERSION=v1.0.0
```

### 3. Build and Push Images

**Linux/Mac:**
```bash
# Push all images (backend + frontend)
./scripts/push-to-dockerhub.sh

# Push only backend
./scripts/push-to-dockerhub.sh backend

# Push only frontend
./scripts/push-to-dockerhub.sh frontend

# Build locally without pushing
./scripts/push-to-dockerhub.sh build-only
```

**Windows:**
```cmd
# Push all images (backend + frontend)
scripts\push-to-dockerhub.bat

# Push only backend
scripts\push-to-dockerhub.bat backend

# Push only frontend
scripts\push-to-dockerhub.bat frontend

# Build locally without pushing
scripts\push-to-dockerhub.bat build-only
```

## 📦 Image Information

After successful push, your images will be available at:

- **Backend**: `https://hub.docker.com/r/YOUR_USERNAME/nlife-backend`
- **Frontend**: `https://hub.docker.com/r/YOUR_USERNAME/nlife-frontend`

### Image Tags

Each image is pushed with two tags:
- `latest` - Always points to the most recent build
- `VERSION` - Specific version tag (e.g., `v1.0.0`)

## 🏃‍♂️ Running from DockerHub

### Option 1: Using docker-compose.dockerhub.yml

```bash
# Set your DockerHub username
export DOCKERHUB_USERNAME=your-dockerhub-username

# Run the application
docker-compose -f docker-compose.dockerhub.yml up -d
```

### Option 2: Manual Docker Commands

```bash
# Pull images
docker pull your-username/nlife-backend:latest
docker pull your-username/nlife-frontend:latest

# Run database
docker run -d --name nlife_db \
  -e POSTGRES_DB=nlife_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=nlife_dev_password \
  -p 5432:5432 \
  postgres:15-alpine

# Run backend
docker run -d --name nlife_backend \
  -e POSTGRES_HOST=nlife_db \
  -e POSTGRES_DB=nlife_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=nlife_dev_password \
  -p 8000:8000 \
  --link nlife_db:db \
  your-username/nlife-backend:latest

# Run frontend
docker run -d --name nlife_frontend \
  -p 3000:80 \
  your-username/nlife-frontend:latest
```

## 🔧 Configuration

### Environment Variables for DockerHub Deployment

Create a `.env` file with your production settings:

```env
# DockerHub Configuration
DOCKERHUB_USERNAME=your-dockerhub-username
VERSION=latest

# Database Configuration
POSTGRES_DB=nlife_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
POSTGRES_HOST=db

# Django Configuration
DJANGO_SECRET_KEY=your-production-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-domain.com,localhost

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-domain.com,http://localhost:3000
```

## 📋 Image Details

### Backend Image (`nlife-backend`)

**Base Image**: `python:3.11-slim`

**Features**:
- Django 4.2+ with Gunicorn
- PostgreSQL client
- Health checks
- Non-root user for security
- Static files collection
- Database migrations

**Exposed Ports**: `8000`

**Health Check**: `http://localhost:8000/api/health/`

### Frontend Image (`nlife-frontend`)

**Base Image**: `node:18-alpine` (build) + `nginx:alpine` (runtime)

**Features**:
- Multi-stage build for optimization
- React production build
- Nginx web server
- Custom Nginx configuration
- Health checks

**Exposed Ports**: `80`

**Health Check**: `http://localhost/`

## 🛠️ Advanced Usage

### Building with Custom Tags

```bash
# Build with specific version
VERSION=v2.1.0 ./scripts/push-to-dockerhub.sh

# Build with custom image names
BACKEND_IMAGE_NAME=my-nlife-api FRONTEND_IMAGE_NAME=my-nlife-web ./scripts/push-to-dockerhub.sh
```

### Cleanup Local Images

```bash
# Clean up local images after pushing
./scripts/push-to-dockerhub.sh all --cleanup
```

### Building for Different Architectures

```bash
# Build for multiple architectures (requires buildx)
docker buildx build --platform linux/amd64,linux/arm64 \
  -t your-username/nlife-backend:latest \
  --push nlife-backend/
```

## 🐛 Troubleshooting

### Common Issues

**1. Docker login fails**
```bash
# Clear Docker credentials and login again
docker logout
docker login
```

**2. Build fails due to permissions**
```bash
# On Linux/Mac, ensure scripts are executable
chmod +x scripts/push-to-dockerhub.sh
```

**3. Push fails due to repository not found**
- Ensure the repository exists on DockerHub
- Check that DOCKERHUB_USERNAME is correct
- Verify you have push permissions

**4. Image size too large**
- Check .dockerignore files are properly configured
- Use multi-stage builds (already implemented)
- Remove unnecessary dependencies

### Verification Commands

```bash
# Check if images were pushed successfully
docker pull your-username/nlife-backend:latest
docker pull your-username/nlife-frontend:latest

# Inspect image details
docker inspect your-username/nlife-backend:latest
docker inspect your-username/nlife-frontend:latest

# Check image sizes
docker images | grep nlife
```

## 📚 Additional Resources

- [DockerHub Documentation](https://docs.docker.com/docker-hub/)
- [Docker Build Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/#use-multi-stage-builds)
- [Docker Security](https://docs.docker.com/engine/security/)

## 🆘 Support

If you encounter issues:

1. Check Docker is running: `docker info`
2. Verify login status: `docker system info | grep Username`
3. Check build logs: `docker build --no-cache .`
4. Test locally first: `./scripts/push-to-dockerhub.sh build-only`
5. Check DockerHub repository settings and permissions
