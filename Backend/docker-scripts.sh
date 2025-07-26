#!/bin/bash

# FullStack Backend Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
    print_status "Docker is running"
}

# Function to build all services
build_all() {
    print_header "Building all services"
    check_docker
    docker-compose build
    print_status "All services built successfully"
}

# Function to start all services
start_all() {
    print_header "Starting all services"
    check_docker
    docker-compose up -d
    print_status "All services started successfully"
    print_status "Eureka Dashboard: http://localhost:8761"
    print_status "API Gateway: http://localhost:8094"
}

# Function to stop all services
stop_all() {
    print_header "Stopping all services"
    docker-compose down
    print_status "All services stopped"
}

# Function to restart all services
restart_all() {
    print_header "Restarting all services"
    stop_all
    start_all
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        print_header "Showing logs for all services"
        docker-compose logs -f
    else
        print_header "Showing logs for $1"
        docker-compose logs -f "$1"
    fi
}

# Function to show status
show_status() {
    print_header "Service Status"
    docker-compose ps
}

# Function to clean up everything
cleanup() {
    print_header "Cleaning up all containers, images, and volumes"
    print_warning "This will remove all data including database data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to build and start a specific service
build_service() {
    if [ -z "$1" ]; then
        print_error "Please specify a service name"
        echo "Available services:"
        docker-compose config --services
        exit 1
    fi
    print_header "Building and starting $1"
    docker-compose build "$1"
    docker-compose up -d "$1"
    print_status "$1 built and started successfully"
}

# Function to show help
show_help() {
    echo "FullStack Backend Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND] [SERVICE]"
    echo ""
    echo "Commands:"
    echo "  build           Build all services"
    echo "  start           Start all services"
    echo "  stop            Stop all services"
    echo "  restart         Restart all services"
    echo "  logs [SERVICE]  Show logs (all services or specific service)"
    echo "  status          Show service status"
    echo "  cleanup         Remove all containers, images, and volumes"
    echo "  service SERVICE Build and start a specific service"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 start"
    echo "  $0 logs auth-service"
    echo "  $0 service user-service"
}

# Main script logic
case "$1" in
    "build")
        build_all
        ;;
    "start")
        start_all
        ;;
    "stop")
        stop_all
        ;;
    "restart")
        restart_all
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "service")
        build_service "$2"
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 