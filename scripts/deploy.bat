@echo off
REM NLife Docker Deployment Script for Windows
REM This script helps deploy the NLife application using Docker

echo 🚀 NLife Docker Deployment Script
echo ==================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)
echo ✅ Docker is running

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose and try again.
    exit /b 1
)
echo ✅ Docker Compose is available

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from .env.development...
    copy .env.development .env >nul
    echo ✅ Environment file created. Please review and update .env file with your settings.
) else (
    echo ✅ Environment file already exists
)

REM Handle command line arguments
if "%1"=="prod" goto production
if "%1"=="production" goto production
if "%1"=="dev" goto development
if "%1"=="development" goto development
if "%1"=="stop" goto stop
if "%1"=="logs" goto logs
if "%1"=="restart" goto restart
goto usage

:production
echo 🏗️  Building and starting production services...
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo ✅ Production services started!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000/api/
echo    Admin Panel: http://localhost:8000/admin/
echo    API Documentation: http://localhost:8000/swagger/
echo.
echo 🔑 Default Admin Credentials:
echo    Email: admin@nlife.com
echo    Password: admin123
goto end

:development
echo 🏗️  Building and starting development services...
docker-compose -f docker-compose.dev.yml down --remove-orphans
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d

echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo ✅ Development services started!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000/api/
echo    Admin Panel: http://localhost:8000/admin/
echo    API Documentation: http://localhost:8000/swagger/
echo.
echo 🔑 Default Admin Credentials:
echo    Email: admin@nlife.com
echo    Password: admin123
goto end

:stop
echo 🛑 Stopping services...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo ✅ Services stopped
goto end

:logs
echo 📋 Showing logs...
docker-compose logs -f
goto end

:restart
echo 🔄 Restarting services...
call %0 stop
timeout /t 5 /nobreak >nul
if "%2"=="dev" (
    call %0 dev
) else (
    call %0 prod
)
goto end

:usage
echo Usage: %0 {prod^|dev^|stop^|logs^|restart [dev]}
echo.
echo Commands:
echo   prod        Deploy production environment
echo   dev         Deploy development environment
echo   stop        Stop all services
echo   logs        Show service logs
echo   restart     Restart services (add 'dev' for development)
echo.
echo Examples:
echo   %0 dev          # Start development environment
echo   %0 prod         # Start production environment
echo   %0 restart dev  # Restart development environment

:end
