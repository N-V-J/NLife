#!/bin/bash

# NLife DockerHub Push Script
# This script builds and pushes NLife backend and frontend images to DockerHub

set -e

echo "🐳 NLife DockerHub Push Script"
echo "=============================="

# Configuration
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-navinvj}"
BACKEND_IMAGE_NAME="${BACKEND_IMAGE_NAME:-nlife-backend}"
FRONTEND_IMAGE_NAME="${FRONTEND_IMAGE_NAME:-nlife-frontend}"
VERSION="${VERSION:-latest}"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running"
}

# Function to check DockerHub credentials
check_credentials() {
    if [ -z "$DOCKERHUB_USERNAME" ]; then
        echo -n "Enter your DockerHub username: "
        read DOCKERHUB_USERNAME
    fi

    if [ -z "$DOCKERHUB_USERNAME" ]; then
        print_error "DockerHub username is required"
        exit 1
    fi

    print_info "Using DockerHub username: $DOCKERHUB_USERNAME"
}

# Function to login to DockerHub
dockerhub_login() {
    print_info "Logging into DockerHub..."
    if ! docker login; then
        print_error "Failed to login to DockerHub"
        exit 1
    fi
    print_status "Successfully logged into DockerHub"
}

# Function to build backend image
build_backend() {
    print_info "Building backend image..."

    cd nlife-backend

    # Build the image with multiple tags
    docker build \
        --build-arg BUILD_DATE="$BUILD_DATE" \
        --build-arg VERSION="$VERSION" \
        -t "$DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:$VERSION" \
        -t "$DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:latest" \
        .

    cd ..
    print_status "Backend image built successfully"
}

# Function to build frontend image
build_frontend() {
    print_info "Building frontend image..."

    cd nlife-frontend

    # Build the image with multiple tags
    docker build \
        --build-arg BUILD_DATE="$BUILD_DATE" \
        --build-arg VERSION="$VERSION" \
        -t "$DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION" \
        -t "$DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:latest" \
        .

    cd ..
    print_status "Frontend image built successfully"
}

# Function to push backend image
push_backend() {
    print_info "Pushing backend image to DockerHub..."

    docker push "$DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:$VERSION"
    docker push "$DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:latest"

    print_status "Backend image pushed successfully"
    print_info "Backend image available at: https://hub.docker.com/r/$DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME"
}

# Function to push frontend image
push_frontend() {
    print_info "Pushing frontend image to DockerHub..."

    docker push "$DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION"
    docker push "$DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:latest"

    print_status "Frontend image pushed successfully"
    print_info "Frontend image available at: https://hub.docker.com/r/$DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME"
}

# Function to show image information
show_image_info() {
    echo ""
    print_info "Image Information:"
    echo "=================="
    echo "Backend Image: $DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:$VERSION"
    echo "Frontend Image: $DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION"
    echo "Build Date: $BUILD_DATE"
    echo ""

    print_info "To pull and run these images:"
    echo "docker pull $DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:$VERSION"
    echo "docker pull $DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION"
    echo ""

    print_info "To run with docker-compose, update your docker-compose.yml:"
    echo "backend:"
    echo "  image: $DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:$VERSION"
    echo "frontend:"
    echo "  image: $DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION"
}

# Function to clean up local images (optional)
cleanup_images() {
    if [ "$1" = "--cleanup" ]; then
        print_info "Cleaning up local images..."
        docker rmi "$DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:$VERSION" || true
        docker rmi "$DOCKERHUB_USERNAME/$BACKEND_IMAGE_NAME:latest" || true
        docker rmi "$DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:$VERSION" || true
        docker rmi "$DOCKERHUB_USERNAME/$FRONTEND_IMAGE_NAME:latest" || true
        print_status "Local images cleaned up"
    fi
}

# Main script logic
main() {
    case "${1:-}" in
        "backend")
            check_docker
            check_credentials
            dockerhub_login
            build_backend
            push_backend
            show_image_info
            cleanup_images "$2"
            ;;
        "frontend")
            check_docker
            check_credentials
            dockerhub_login
            build_frontend
            push_frontend
            show_image_info
            cleanup_images "$2"
            ;;
        "all"|"")
            check_docker
            check_credentials
            dockerhub_login
            build_backend
            build_frontend
            push_backend
            push_frontend
            show_image_info
            cleanup_images "$2"
            ;;
        "build-only")
            check_docker
            check_credentials
            build_backend
            build_frontend
            print_status "Images built locally (not pushed to DockerHub)"
            ;;
        *)
            echo "Usage: $0 {all|backend|frontend|build-only} [--cleanup]"
            echo ""
            echo "Commands:"
            echo "  all         Build and push both backend and frontend images (default)"
            echo "  backend     Build and push only backend image"
            echo "  frontend    Build and push only frontend image"
            echo "  build-only  Build images locally without pushing"
            echo ""
            echo "Options:"
            echo "  --cleanup   Remove local images after pushing"
            echo ""
            echo "Environment Variables:"
            echo "  DOCKERHUB_USERNAME    Your DockerHub username"
            echo "  BACKEND_IMAGE_NAME    Backend image name (default: nlife-backend)"
            echo "  FRONTEND_IMAGE_NAME   Frontend image name (default: nlife-frontend)"
            echo "  VERSION              Image version tag (default: latest)"
            echo ""
            echo "Examples:"
            echo "  $0                    # Build and push all images"
            echo "  $0 backend            # Build and push only backend"
            echo "  $0 all --cleanup      # Build, push, and cleanup local images"
            echo "  VERSION=v1.0.0 $0     # Build and push with version tag"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
