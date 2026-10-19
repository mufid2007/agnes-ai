Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Agnes 3.0 Flash Platform Setup & Verification" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "`n[1] Checking Environment..." -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "  Python found: $(python --version)" -ForegroundColor Green
} else {
    Write-Host "  Python not in PATH. Please install Python 3.10+ or use Docker." -ForegroundColor Red
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "  Node/NPM found: $(npm --version)" -ForegroundColor Green
} else {
    Write-Host "  NPM not in PATH. Please install Node.js LTS or use Docker." -ForegroundColor Red
}

Write-Host "`n[2] Docker Alternative:" -ForegroundColor Yellow
Write-Host "  If Docker is installed, run: docker compose up --build" -ForegroundColor Cyan

Write-Host "`n[3] Ready to Launch!" -ForegroundColor Green
Write-Host "  Run start-app.bat or start backend and frontend in separate terminals." -ForegroundColor White
