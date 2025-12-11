# PowerShell script to start dev server and open prototype viewer
# Usage: .\open-prototypes.ps1

$port = 3000
$url = "http://localhost:$port/prototypes"

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Check if dev server is already running
if (Test-Port -Port $port) {
    Write-Host "Dev server is already running on port $port" -ForegroundColor Green
    Write-Host "Opening prototype viewer..." -ForegroundColor Cyan
    Start-Process $url
} else {
    Write-Host "Starting dev server..." -ForegroundColor Yellow
    
    # Start dev server in background
    $job = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        npm run dev
    }
    
    Write-Host "Waiting for server to start..." -ForegroundColor Yellow
    
    # Wait for server to be ready (max 30 seconds)
    $timeout = 30
    $elapsed = 0
    $interval = 1
    
    while (-not (Test-Port -Port $port) -and $elapsed -lt $timeout) {
        Start-Sleep -Seconds $interval
        $elapsed += $interval
        Write-Host "." -NoNewline -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    if (Test-Port -Port $port) {
        Write-Host "Server started successfully!" -ForegroundColor Green
        Write-Host "Opening prototype viewer..." -ForegroundColor Cyan
        Start-Process $url
        
        Write-Host ""
        Write-Host "Dev server is running in the background." -ForegroundColor Green
        Write-Host "To stop the server, run: Stop-Job -Id $($job.Id); Remove-Job -Id $($job.Id)" -ForegroundColor Gray
    } else {
        Write-Host "Server failed to start within $timeout seconds." -ForegroundColor Red
        Stop-Job -Id $job.Id
        Remove-Job -Id $job.Id
        exit 1
    }
}

