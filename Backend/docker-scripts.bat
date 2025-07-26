@echo off
setlocal enabledelayedexpansion

REM FullStack Backend Docker Management Script for Windows

REM Colors for output (Windows 10+)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo %GREEN%[INFO]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:print_header
echo %BLUE%=== %~1 ===%NC%
goto :eof

REM Function to check if Docker is running
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not running. Please start Docker Desktop first."
    exit /b 1
)
call :print_status "Docker is running"
goto :eof

REM Function to build all services
:build_all
call :print_header "Building all services"
call :check_docker
if errorlevel 1 exit /b 1
docker-compose build
call :print_status "All services built successfully"
goto :eof

REM Function to start all services
:start_all
call :print_header "Starting all services"
call :check_docker
if errorlevel 1 exit /b 1
docker-compose up -d
call :print_status "All services started successfully"
call :print_status "Eureka Dashboard: http://localhost:8761"
call :print_status "API Gateway: http://localhost:8094"
goto :eof

REM Function to stop all services
:stop_all
call :print_header "Stopping all services"
docker-compose down
call :print_status "All services stopped"
goto :eof

REM Function to restart all services
:restart_all
call :print_header "Restarting all services"
call :stop_all
call :start_all
goto :eof

REM Function to show logs
:show_logs
if "%~1"=="" (
    call :print_header "Showing logs for all services"
    docker-compose logs -f
) else (
    call :print_header "Showing logs for %~1"
    docker-compose logs -f "%~1"
)
goto :eof

REM Function to show status
:show_status
call :print_header "Service Status"
docker-compose ps
goto :eof

REM Function to clean up everything
:cleanup
call :print_header "Cleaning up all containers, images, and volumes"
call :print_warning "This will remove all data including database data!"
set /p confirm="Are you sure? (y/N): "
if /i "!confirm!"=="y" (
    docker-compose down -v --rmi all
    docker system prune -f
    call :print_status "Cleanup completed"
) else (
    call :print_status "Cleanup cancelled"
)
goto :eof

REM Function to build and start a specific service
:build_service
if "%~1"=="" (
    call :print_error "Please specify a service name"
    echo Available services:
    docker-compose config --services
    exit /b 1
)
call :print_header "Building and starting %~1"
docker-compose build "%~1"
docker-compose up -d "%~1"
call :print_status "%~1 built and started successfully"
goto :eof

REM Function to show help
:show_help
echo FullStack Backend Docker Management Script
echo.
echo Usage: %~nx0 [COMMAND] [SERVICE]
echo.
echo Commands:
echo   build           Build all services
echo   start           Start all services
echo   stop            Stop all services
echo   restart         Restart all services
echo   logs [SERVICE]  Show logs (all services or specific service)
echo   status          Show service status
echo   cleanup         Remove all containers, images, and volumes
echo   service SERVICE Build and start a specific service
echo   help            Show this help message
echo.
echo Examples:
echo   %~nx0 build
echo   %~nx0 start
echo   %~nx0 logs auth-service
echo   %~nx0 service user-service
goto :eof

REM Main script logic
if "%~1"=="" goto :show_help
if "%~1"=="help" goto :show_help
if "%~1"=="--help" goto :show_help
if "%~1"=="-h" goto :show_help

if "%~1"=="build" goto :build_all
if "%~1"=="start" goto :start_all
if "%~1"=="stop" goto :stop_all
if "%~1"=="restart" goto :restart_all
if "%~1"=="logs" goto :show_logs
if "%~1"=="status" goto :show_status
if "%~1"=="cleanup" goto :cleanup
if "%~1"=="service" goto :build_service

call :print_error "Unknown command: %~1"
echo.
goto :show_help 