# Render Database Connection Guide

This guide explains how to connect your NLife application database with Render platform.

## Option 1: Render Managed PostgreSQL (Recommended)

### Step 1: Create PostgreSQL Database on Render

1. **Login to Render Dashboard**
   - Go to [render.com](https://render.com)
   - Sign in to your account

2. **Create New PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Fill in the details:
     - **Name**: `nlife-database` (or your preferred name)
     - **Database**: `nlife_db`
     - **User**: `nlife_user` (or your preferred username)
     - **Region**: Choose closest to your users
     - **PostgreSQL Version**: 15 (recommended)
     - **Plan**: Choose based on your needs (Free tier available)

3. **Note Database Connection Details**
   After creation, Render will provide:
   - **Internal Database URL**: For connecting from Render services
   - **External Database URL**: For connecting from outside Render
   - **Connection parameters**: Host, Port, Database, Username, Password

### Step 2: Deploy Backend Service on Render

1. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `nlife-backend`
     - **Environment**: Docker
     - **Build Command**: `docker build -f nlife-backend/Dockerfile -t nlife-backend ./nlife-backend`
     - **Start Command**: `docker run -p 8000:8000 nlife-backend`

2. **Set Environment Variables**
   In the Render dashboard, add these environment variables:
   ```
   DATABASE_URL=<your-render-database-internal-url>
   DJANGO_SECRET_KEY=<generate-a-secure-secret-key>
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=<your-render-backend-url>,localhost
   CORS_ALLOWED_ORIGINS=<your-render-frontend-url>
   ```

### Step 3: Deploy Frontend Service on Render

1. **Create Static Site**
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `nlife-frontend`
     - **Build Command**: `cd nlife-frontend && npm install && npm run build`
     - **Publish Directory**: `nlife-frontend/dist`

2. **Set Environment Variables**
   ```
   REACT_APP_API_URL=<your-render-backend-url>/api
   ```

## Option 2: External Database Connection

If you prefer to use an external PostgreSQL database (like AWS RDS, Google Cloud SQL, etc.):

### Step 1: Get Database Connection Details
- Host, Port, Database name, Username, Password
- Ensure the database allows connections from Render's IP ranges

### Step 2: Configure Environment Variables
```
DATABASE_URL=postgresql://username:password@host:port/database_name
DJANGO_SECRET_KEY=<your-secret-key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=<your-render-service-url>
```

## Environment Variables Reference

### Required for Backend Service
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Django Configuration
DJANGO_SECRET_KEY=your-super-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-backend-url.onrender.com,localhost

# CORS (for frontend communication)
CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com

# Optional: Redis (if using Redis on Render)
REDIS_URL=redis://your-redis-url.onrender.com:6379
```

### Required for Frontend Service
```bash
# API endpoint
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Database Migration and Setup

### Initial Setup
1. **Run Migrations**: Your Docker container automatically runs migrations on startup
2. **Create Superuser**: The container also creates a superuser automatically
3. **Load Initial Data**: If you have fixtures, they'll be loaded during startup

### Manual Database Operations
If you need to run manual database operations:

1. **Connect to your Render service shell**:
   ```bash
   # From Render dashboard, open shell for your backend service
   python manage.py shell
   ```

2. **Run specific migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Create superuser manually**:
   ```bash
   python manage.py createsuperuser
   ```

## Security Considerations

1. **Secret Key**: Generate a strong secret key for production
2. **Database Password**: Use a strong password for your database
3. **CORS**: Only allow your frontend domain in CORS_ALLOWED_ORIGINS
4. **Debug Mode**: Always set DJANGO_DEBUG=False in production
5. **Allowed Hosts**: Only include your actual domain in DJANGO_ALLOWED_HOSTS

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database is running and accessible
   - Check firewall/security group settings

2. **CORS Errors**
   - Verify CORS_ALLOWED_ORIGINS includes your frontend URL
   - Check that URLs match exactly (https vs http)

3. **Static Files Not Loading**
   - Ensure collectstatic runs during deployment
   - Check static file configuration in Django settings

### Logs and Monitoring
- Use Render's built-in logging to monitor your application
- Check both backend and database logs for connection issues
- Monitor database performance and usage

## Next Steps

1. Set up your PostgreSQL database on Render
2. Deploy your backend service with proper environment variables
3. Deploy your frontend service
4. Test the connection between all components
5. Set up monitoring and backups for your database

For more detailed Render documentation, visit: https://render.com/docs
