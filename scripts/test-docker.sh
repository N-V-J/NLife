#!/bin/bash

# Docker Setup Test Script
# This script tests if Docker and Docker Compose are properly configured

echo "🧪 NLife Docker Setup Test"
echo "=========================="

# Test 1: Check Docker installation
echo "1. Testing Docker installation..."
if command -v docker > /dev/null 2>&1; then
    echo "   ✅ Docker is installed"
    docker --version
else
    echo "   ❌ Docker is not installed"
    exit 1
fi

# Test 2: Check Docker daemon
echo ""
echo "2. Testing Docker daemon..."
if docker info > /dev/null 2>&1; then
    echo "   ✅ Docker daemon is running"
else
    echo "   ❌ Docker daemon is not running"
    exit 1
fi

# Test 3: Check Docker Compose
echo ""
echo "3. Testing Docker Compose..."
if command -v docker-compose > /dev/null 2>&1; then
    echo "   ✅ Docker Compose is installed"
    docker-compose --version
else
    echo "   ❌ Docker Compose is not installed"
    exit 1
fi

# Test 4: Check environment file
echo ""
echo "4. Testing environment configuration..."
if [ -f .env ]; then
    echo "   ✅ Environment file exists"
elif [ -f .env.development ]; then
    echo "   ⚠️  Using development environment file"
    echo "   💡 Run: cp .env.development .env"
else
    echo "   ❌ No environment file found"
    echo "   💡 Run: cp .env.example .env"
fi

# Test 5: Check Docker Compose files
echo ""
echo "5. Testing Docker Compose configuration..."
if [ -f docker-compose.yml ]; then
    echo "   ✅ Production compose file exists"
    if docker-compose config > /dev/null 2>&1; then
        echo "   ✅ Production compose file is valid"
    else
        echo "   ❌ Production compose file has errors"
    fi
else
    echo "   ❌ Production compose file not found"
fi

if [ -f docker-compose.dev.yml ]; then
    echo "   ✅ Development compose file exists"
    if docker-compose -f docker-compose.dev.yml config > /dev/null 2>&1; then
        echo "   ✅ Development compose file is valid"
    else
        echo "   ❌ Development compose file has errors"
    fi
else
    echo "   ❌ Development compose file not found"
fi

# Test 6: Check Dockerfiles
echo ""
echo "6. Testing Dockerfiles..."
if [ -f nlife-backend/Dockerfile ]; then
    echo "   ✅ Backend Dockerfile exists"
else
    echo "   ❌ Backend Dockerfile not found"
fi

if [ -f nlife-frontend/Dockerfile ]; then
    echo "   ✅ Frontend Dockerfile exists"
else
    echo "   ❌ Frontend Dockerfile not found"
fi

# Test 7: Check available ports
echo ""
echo "7. Testing port availability..."
check_port() {
    local port=$1
    local service=$2
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "   ⚠️  Port $port ($service) is already in use"
    else
        echo "   ✅ Port $port ($service) is available"
    fi
}

check_port 3000 "Frontend"
check_port 5173 "Frontend Dev"
check_port 8000 "Backend"
check_port 5432 "Database"
check_port 6379 "Redis"

echo ""
echo "🎉 Docker setup test completed!"
echo ""
echo "Next steps:"
echo "1. If all tests passed, run: ./scripts/deploy.sh dev"
echo "2. If there are issues, fix them and run this test again"
echo "3. For production deployment, run: ./scripts/deploy.sh prod"
