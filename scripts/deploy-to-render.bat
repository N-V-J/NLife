@echo off
REM Deploy NLife to Render Platform
REM This script helps you deploy your application to Render

echo 🚀 NLife Render Deployment Script
echo ==================================

REM Check if render.yaml exists
if not exist "render.yaml" (
    echo ❌ render.yaml not found. Please ensure you're in the project root directory.
    pause
    exit /b 1
)

echo 📋 Pre-deployment Checklist:
echo 1. ✅ render.yaml file exists
echo 2. 🔍 Checking Docker files...

REM Check if Dockerfiles exist
if not exist "nlife-backend\Dockerfile" (
    echo ❌ Backend Dockerfile not found at nlife-backend\Dockerfile
    pause
    exit /b 1
)

if not exist "nlife-frontend\Dockerfile" (
    echo ❌ Frontend Dockerfile not found at nlife-frontend\Dockerfile
    pause
    exit /b 1
)

echo 3. ✅ Docker files found
echo.

echo 🔧 Environment Variables Setup:
echo Run the following command to generate environment variables:
echo python scripts\generate-render-env.py
echo.

echo 📚 Deployment Steps:
echo ===================
echo.
echo 1. 🌐 Go to https://render.com and sign in
echo.
echo 2. 📁 Create a new Blueprint:
echo    - Click 'New' → 'Blueprint'
echo    - Connect your GitHub repository
echo    - Render will automatically detect the render.yaml file
echo.
echo 3. 🔧 Configure Services:
echo    - Review the services that will be created:
echo      • PostgreSQL Database (nlife-database)
echo      • Backend Web Service (nlife-backend)
echo      • Frontend Static Site (nlife-frontend)
echo.
echo 4. 🔑 Set Environment Variables:
echo    - Run: python scripts\generate-render-env.py
echo    - Copy the generated variables to each service
echo.
echo 5. 🚀 Deploy:
echo    - Click 'Create New Resources'
echo    - Wait for all services to deploy
echo.
echo 6. 🔗 Update URLs:
echo    - Once deployed, update the environment variables with actual URLs:
echo      • DJANGO_ALLOWED_HOSTS: Add your backend URL
echo      • CORS_ALLOWED_ORIGINS: Add your frontend URL
echo      • REACT_APP_API_URL: Set to your backend URL + /api
echo.
echo 7. ✅ Test Your Application:
echo    - Visit your frontend URL
echo    - Test API endpoints
echo    - Check database connectivity
echo.

echo 🔍 Troubleshooting:
echo ==================
echo • Check logs in Render dashboard if deployment fails
echo • Ensure all environment variables are set correctly
echo • Verify database connection string format
echo • Check that Docker builds succeed locally first
echo.

echo 📖 For detailed instructions, see: RENDER_DATABASE_SETUP.md
echo.
echo 🎉 Good luck with your deployment!
echo.
pause
