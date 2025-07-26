# FullStack Backend Docker Management Script for PowerShell

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Service
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "=== $Message ===" -ForegroundColor $Blue
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Status "Docker is running"
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker Desktop first."
        return $false
    }
}

# Function to build all services
function Build-AllServices {
    Write-Header "Building all services"
    if (-not (Test-Docker)) { return }
    docker-compose build
    Write-Status "All services built successfully"
}

# Function to start all services
function Start-AllServices {
    Write-Header "Starting all services"
    if (-not (Test-Docker)) { return }
    docker-compose up -d
    Write-Status "All services started successfully"
    Write-Status "Eureka Dashboard: http://localhost:8761"
    Write-Status "API Gateway: http://localhost:8094"
}

# Function to stop all services
function Stop-AllServices {
    Write-Header "Stopping all services"
    docker-compose down
    Write-Status "All services stopped"
}

# Function to restart all services
function Restart-AllServices {
    Write-Header "Restarting all services"
    Stop-AllServices
    Start-AllServices
}

# Function to show logs
function Show-Logs {
    param([string]$ServiceName = "")
    
    if ([string]::IsNullOrEmpty($ServiceName)) {
        Write-Header "Showing logs for all services"
        docker-compose logs -f
    } else {
        Write-Header "Showing logs for $ServiceName"
        docker-compose logs -f $ServiceName
    }
}

# Function to show status
function Show-Status {
    Write-Header "Service Status"
    docker-compose ps
}

# Function to clean up everything
function Clear-All {
    Write-Header "Cleaning up all containers, images, and volumes"
    Write-Warning "This will remove all data including database data!"
    $confirm = Read-Host "Are you sure? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        docker-compose down -v --rmi all
        docker system prune -f
        Write-Status "Cleanup completed"
    } else {
        Write-Status "Cleanup cancelled"
    }
}

# Function to build and start a specific service
function Build-Service {
    param([string]$ServiceName)
    
    if ([string]::IsNullOrEmpty($ServiceName)) {
        Write-Error "Please specify a service name"
        Write-Host "Available services:"
        docker-compose config --services
        return
    }
    
    Write-Header "Building and starting $ServiceName"
    docker-compose build $ServiceName
    docker-compose up -d $ServiceName
    Write-Status "$ServiceName built and started successfully"
}

# Function to show help
function Show-Help {
    Write-Host "FullStack Backend Docker Management Script" -ForegroundColor $Blue
    Write-Host ""
    Write-Host "Usage: .\docker-scripts.ps1 [COMMAND] [SERVICE]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  build           Build all services"
    Write-Host "  start           Start all services"
    Write-Host "  stop            Stop all services"
    Write-Host "  restart         Restart all services"
    Write-Host "  logs [SERVICE]  Show logs (all services or specific service)"
    Write-Host "  status          Show service status"
    Write-Host "  cleanup         Remove all containers, images, and volumes"
    Write-Host "  service SERVICE Build and start a specific service"
    Write-Host "  help            Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\docker-scripts.ps1 build"
    Write-Host "  .\docker-scripts.ps1 start"
    Write-Host "  .\docker-scripts.ps1 logs auth-service"
    Write-Host "  .\docker-scripts.ps1 service user-service"
}

# Main script logic
switch ($Command.ToLower()) {
    "build" { Build-AllServices }
    "start" { Start-AllServices }
    "stop" { Stop-AllServices }
    "restart" { Restart-AllServices }
    "logs" { Show-Logs $Service }
    "status" { Show-Status }
    "cleanup" { Clear-All }
    "service" { Build-Service $Service }
    "help" { Show-Help }
    "" { Show-Help }
    default {
        Write-Error "Unknown command: $Command"
        Write-Host ""
        Show-Help
    }
} 