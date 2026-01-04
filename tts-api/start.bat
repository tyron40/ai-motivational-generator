@echo off
echo ============================================
echo Starting NeuTTS Air TTS API
echo ============================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo ERROR: Virtual environment not found!
    echo Please run setup-windows.bat first
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Creating from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit .env and set a secure API_KEY before using in production
    echo.
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start the API
echo Starting API on port 8080...
echo Press Ctrl+C to stop
echo.
python app.py
