# Production Launch Script for SUE Research Portal
Write-Host "=========================================================" -ForegroundColor Header
Write-Host "   SUE Research Portal - One-Command Production Launcher " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Header

Write-Host "Step 1: Pushing latest commits to Remote Git..." -ForegroundColor Yellow
git push origin main

Write-Host "Step 2: Building and launching Docker Compose stack..." -ForegroundColor Yellow
docker compose up --build -d

Write-Host "`nSystem successfully launched!" -ForegroundColor Green
Write-Host " - Frontend Web Portal: http://localhost:3001" -ForegroundColor White
Write-Host " - Headless REST API:  http://localhost:3000" -ForegroundColor White
Write-Host " - PostgreSQL Database: localhost:5432" -ForegroundColor White
