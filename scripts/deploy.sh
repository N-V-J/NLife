#!/bin/bash

# NLife Docker Deployment Script
# This script helps deploy the NLife application using Docker

set -e

echo "🚀 NLife Docker Deployment Script"
echo "=================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    echo "✅ Docker Compose is available"
}

# Function to create environment file if it doesn't exist
setup_environment() {
    if [ ! -f .env ]; then
        echo "📝 Creating .env file from .env.development..."
        cp .env.development .env
        echo "✅ Environment file created. Please review and update .env file with your settings."
    else
        echo "✅ Environment file already exists"
    fi
}

# Function to build and start services
deploy_production() {
    echo "🏗️  Building and starting production services..."
    docker-compose down --remove-orphans
    docker-compose build --no-cache
    docker-compose up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Check if services are healthy
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Services are running!"
        echo ""
        echo "🌐 Application URLs:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend API: http://localhost:8000/api/"
        echo "   Admin Panel: http://localhost:8000/admin/"
        echo "   API Documentation: http://localhost:8000/swagger/"
        echo ""
        echo "🔑 Default Admin Credentials:"
        echo "   Email: admin@nlife.com"
        echo "   Password: admin123"
    else
        echo "❌ Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Function to deploy development environment
deploy_development() {
    echo "🏗️  Building and starting development services..."
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.dev.yml up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Check if services are healthy
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        echo "✅ Development services are running!"
        echo ""
        echo "🌐 Application URLs:"
        echo "   Frontend: http://localhost:5173"
        echo "   Backend API: http://localhost:8000/api/"
        echo "   Admin Panel: http://localhost:8000/admin/"
        echo "   API Documentation: http://localhost:8000/swagger/"
        echo ""
        echo "🔑 Default Admin Credentials:"
        echo "   Email: admin@nlife.com"
        echo "   Password: admin123"
    else
        echo "❌ Some services failed to start. Check logs with: docker-compose -f docker-compose.dev.yml logs"
        exit 1
    fi
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Services stopped"
}

# Function to show logs
show_logs() {
    echo "📋 Showing logs..."
    if [ -f docker-compose.dev.yml ] && docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Main script logic
case "${1:-}" in
    "prod"|"production")
        check_docker
        check_docker_compose
        setup_environment
        deploy_production
        ;;
    "dev"|"development")
        check_docker
        check_docker_compose
        setup_environment
        deploy_development
        ;;
    "stop")
        stop_services
        ;;
    "logs")
        show_logs
        ;;
    "restart")
        stop_services
        sleep 5
        if [ "${2:-}" = "dev" ]; then
            deploy_development
        else
            deploy_production
        fi
        ;;
    *)
        echo "Usage: $0 {prod|dev|stop|logs|restart [dev]}"
        echo ""
        echo "Commands:"
        echo "  prod        Deploy production environment"
        echo "  dev         Deploy development environment"
        echo "  stop        Stop all services"
        echo "  logs        Show service logs"
        echo "  restart     Restart services (add 'dev' for development)"
        echo ""
        echo "Examples:"
        echo "  $0 dev          # Start development environment"
        echo "  $0 prod         # Start production environment"
        echo "  $0 restart dev  # Restart development environment"
        exit 1
        ;;
esac
