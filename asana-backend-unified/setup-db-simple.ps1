# Simple database setup script
Write-Host "Setting up PostgreSQL database for Asana..." -ForegroundColor Green

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

if (-not (Test-Path $psqlPath)) {
    Write-Host "Error: Could not find psql.exe at $psqlPath" -ForegroundColor Red
    exit 1
}

Write-Host "Found psql at: $psqlPath" -ForegroundColor Green

# Check if database already exists
Write-Host "Checking if database exists..." -ForegroundColor Yellow
try {
    $result = & $psqlPath -U postgres -d postgres -c "SELECT 1 FROM pg_database WHERE datname='asana_db';" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database asana_db already exists!" -ForegroundColor Green
    } else {
        Write-Host "Database does not exist. Please run the setup manually:" -ForegroundColor Yellow
        Write-Host "1. Open pgAdmin or psql" -ForegroundColor Gray
        Write-Host "2. Run: CREATE DATABASE asana_db;" -ForegroundColor Gray
        Write-Host "3. Run: CREATE USER asanauser WITH PASSWORD 'asanapassword';" -ForegroundColor Gray
        Write-Host "4. Run: GRANT ALL PRIVILEGES ON DATABASE asana_db TO asanauser;" -ForegroundColor Gray
    }
} catch {
    Write-Host "Error checking database: $_" -ForegroundColor Red
} 