@echo off
setlocal enabledelayedexpansion

REM NLife DockerHub Push Script for Windows
REM This script builds and pushes NLife backend and frontend images to DockerHub

echo 🐳 NLife DockerHub Push Script
echo ==============================

REM Configuration
if "%DOCKERHUB_USERNAME%"=="" set DOCKERHUB_USERNAME=navinvj
if "%BACKEND_IMAGE_NAME%"=="" set BACKEND_IMAGE_NAME=nlife-backend
if "%FRONTEND_IMAGE_NAME%"=="" set FRONTEND_IMAGE_NAME=nlife-frontend
if "%VERSION%"=="" set VERSION=latest

REM Get current date/time for build metadata
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "BUILD_DATE=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%T%dt:~8,2%:%dt:~10,2%:%dt:~12,2%Z"

if "%DOCKERHUB_USERNAME%"=="" (
    echo ❌ DockerHub username is required
    exit /b 1
)

echo ℹ️  Using DockerHub username: %DOCKERHUB_USERNAME%
echo ℹ️  Backend image: %DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:%VERSION%
echo ℹ️  Frontend image: %DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:%VERSION%
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)
echo ✅ Docker is running

REM Function to build backend
:build_backend
echo ℹ️  Building backend image...
cd nlife-backend
docker build --build-arg BUILD_DATE="%BUILD_DATE%" --build-arg VERSION="%VERSION%" -t "%DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:%VERSION%" -t "%DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:latest" .
if errorlevel 1 (
    echo ❌ Failed to build backend image
    cd ..
    exit /b 1
)
cd ..
echo ✅ Backend image built successfully
goto :eof

REM Function to build frontend
:build_frontend
echo ℹ️  Building frontend image...
cd nlife-frontend
docker build --build-arg BUILD_DATE="%BUILD_DATE%" --build-arg VERSION="%VERSION%" -t "%DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:%VERSION%" -t "%DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:latest" .
if errorlevel 1 (
    echo ❌ Failed to build frontend image
    cd ..
    exit /b 1
)
cd ..
echo ✅ Frontend image built successfully
goto :eof

REM Function to push backend
:push_backend
echo ℹ️  Pushing backend image to DockerHub...
docker push "%DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:%VERSION%"
if errorlevel 1 (
    echo ❌ Failed to push backend image
    exit /b 1
)
docker push "%DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:latest"
if errorlevel 1 (
    echo ❌ Failed to push backend image (latest tag)
    exit /b 1
)
echo ✅ Backend image pushed successfully
echo ℹ️  Backend image available at: https://hub.docker.com/r/%DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%
goto :eof

REM Function to push frontend
:push_frontend
echo ℹ️  Pushing frontend image to DockerHub...
docker push "%DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:%VERSION%"
if errorlevel 1 (
    echo ❌ Failed to push frontend image
    exit /b 1
)
docker push "%DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:latest"
if errorlevel 1 (
    echo ❌ Failed to push frontend image (latest tag)
    exit /b 1
)
echo ✅ Frontend image pushed successfully
echo ℹ️  Frontend image available at: https://hub.docker.com/r/%DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%
goto :eof

REM Function to show image information
:show_image_info
echo.
echo ℹ️  Image Information:
echo ==================
echo Backend Image: %DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:%VERSION%
echo Frontend Image: %DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:%VERSION%
echo Build Date: %BUILD_DATE%
echo.
echo ℹ️  To pull and run these images:
echo docker pull %DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:%VERSION%
echo docker pull %DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:%VERSION%
echo.
echo ℹ️  To run with docker-compose, update your docker-compose.yml:
echo backend:
echo   image: %DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:%VERSION%
echo frontend:
echo   image: %DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:%VERSION%
goto :eof

REM Function to cleanup images
:cleanup_images
if "%2"=="--cleanup" (
    echo ℹ️  Cleaning up local images...
    docker rmi "%DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:%VERSION%" 2>nul
    docker rmi "%DOCKERHUB_USERNAME%/%BACKEND_IMAGE_NAME%:latest" 2>nul
    docker rmi "%DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:%VERSION%" 2>nul
    docker rmi "%DOCKERHUB_USERNAME%/%FRONTEND_IMAGE_NAME%:latest" 2>nul
    echo ✅ Local images cleaned up
)
goto :eof

REM Login to DockerHub
echo ℹ️  Logging into DockerHub...
docker login
if errorlevel 1 (
    echo ❌ Failed to login to DockerHub
    exit /b 1
)
echo ✅ Successfully logged into DockerHub

REM Main script logic
if "%1"=="backend" (
    call :build_backend
    call :push_backend
    call :show_image_info
    call :cleanup_images %1 %2
) else if "%1"=="frontend" (
    call :build_frontend
    call :push_frontend
    call :show_image_info
    call :cleanup_images %1 %2
) else if "%1"=="build-only" (
    call :build_backend
    call :build_frontend
    echo ✅ Images built locally (not pushed to DockerHub)
) else if "%1"=="all" (
    call :build_backend
    call :build_frontend
    call :push_backend
    call :push_frontend
    call :show_image_info
    call :cleanup_images %1 %2
) else if "%1"=="" (
    call :build_backend
    call :build_frontend
    call :push_backend
    call :push_frontend
    call :show_image_info
    call :cleanup_images %1 %2
) else (
    echo Usage: %0 {all^|backend^|frontend^|build-only} [--cleanup]
    echo.
    echo Commands:
    echo   all         Build and push both backend and frontend images (default)
    echo   backend     Build and push only backend image
    echo   frontend    Build and push only frontend image
    echo   build-only  Build images locally without pushing
    echo.
    echo Options:
    echo   --cleanup   Remove local images after pushing
    echo.
    echo Environment Variables:
    echo   DOCKERHUB_USERNAME    Your DockerHub username
    echo   BACKEND_IMAGE_NAME    Backend image name (default: nlife-backend)
    echo   FRONTEND_IMAGE_NAME   Frontend image name (default: nlife-frontend)
    echo   VERSION              Image version tag (default: latest)
    echo.
    echo Examples:
    echo   %0                    # Build and push all images
    echo   %0 backend            # Build and push only backend
    echo   %0 all --cleanup      # Build, push, and cleanup local images
    echo   set VERSION=v1.0.0 ^&^& %0     # Build and push with version tag
    exit /b 1
)

echo.
echo ✅ Script completed successfully!
