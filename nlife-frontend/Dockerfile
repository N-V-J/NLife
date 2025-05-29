# Multi-stage build for React application

# Stage 1: Build the application
FROM node:18-alpine AS builder

# Add metadata labels for DockerHub
LABEL maintainer="NLife Team"
LABEL description="NLife Hospital Management System - Frontend"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/your-org/nlife"
LABEL org.opencontainers.image.description="React-based frontend for NLife Hospital Management System"
LABEL org.opencontainers.image.licenses="MIT"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
