@echo off
echo ========================================
echo AI Motivational Generator - Dev Setup
echo ========================================
echo.

echo Checking if services are already running...
echo.

REM Check if ports are in use
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 3000 is already in use (Frontend)
)

netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 3001 is already in use (Backend)
)

netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8000 is already in use (TTS Service)
)

echo.
echo Starting services...
echo.

REM Start Railway TTS Service
echo [1/3] Starting Railway TTS Service...
start "TTS Service" cmd /k "cd railway-tts-service && venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

REM Start Backend
echo [2/3] Starting Backend API...
start "Backend API" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Frontend:    http://localhost:3000
echo Backend:     http://localhost:3001
echo TTS Service: http://localhost:8000
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000

echo.
echo To stop all services, close the terminal windows.
echo.
pause
