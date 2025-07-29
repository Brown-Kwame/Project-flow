# PowerShell script to set up PostgreSQL database for Asana
# This script assumes PostgreSQL is installed and running

Write-Host "Setting up PostgreSQL database for Asana..." -ForegroundColor Green

# Try to find psql in common PostgreSQL installation paths
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $psqlPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        break
    }
}

if (-not $psqlPath) {
    Write-Host "Error: Could not find psql.exe. Please ensure PostgreSQL is installed." -ForegroundColor Red
    Write-Host "Common installation paths checked:" -ForegroundColor Yellow
    $psqlPaths | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    exit 1
}

Write-Host "Found psql at: $psqlPath" -ForegroundColor Green

# Check if PostgreSQL is running
$postgresService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if (-not $postgresService -or $postgresService.Status -ne "Running") {
    Write-Host "Error: PostgreSQL service is not running. Please start PostgreSQL first." -ForegroundColor Red
    exit 1
}

Write-Host "PostgreSQL service is running." -ForegroundColor Green

# Run the setup script
Write-Host "Running database setup script..." -ForegroundColor Green
try {
    & $psqlPath -U postgres -f setup-database.sql
    Write-Host "Database setup completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error running database setup: $_" -ForegroundColor Red
    Write-Host "You may need to run this manually with:" -ForegroundColor Yellow
    Write-Host "  & '$psqlPath' -U postgres -f setup-database.sql" -ForegroundColor Gray
} 