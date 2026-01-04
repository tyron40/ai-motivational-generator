@echo off
echo ============================================
echo NeuTTS Air TTS API - Windows Setup
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9 from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/6] Checking Python version...
python --version

echo.
echo [2/6] Checking if espeak-ng is installed...
where espeak-ng >nul 2>&1
if errorlevel 1 (
    echo WARNING: espeak-ng not found!
    echo Please install it using one of these methods:
    echo   1. winget install -e --id eSpeak-NG.eSpeak-NG
    echo   2. choco install espeak-ng
    echo   3. Download MSI from https://github.com/espeak-ng/espeak-ng/releases
    echo.
    echo After installation, you may need to set environment variables:
    echo   setx PHONEMIZER_ESPEAK_LIBRARY "c:\Program Files\eSpeak NG\libespeak-ng.dll"
    echo   setx PHONEMIZER_ESPEAK_PATH "c:\Program Files\eSpeak NG"
    echo.
    pause
) else (
    echo espeak-ng found!
)

echo.
echo [3/6] Checking if neutts-air is cloned...
if not exist "neutts-air" (
    echo Cloning NeuTTS Air repository...
    git clone https://github.com/neuphonic/neutts-air.git
    if errorlevel 1 (
        echo ERROR: Failed to clone NeuTTS Air
        pause
        exit /b 1
    )
) else (
    echo neutts-air directory already exists
)

echo.
echo [4/6] Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
) else (
    echo Virtual environment already exists
)

echo.
echo [5/6] Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [6/6] Creating .env file...
if not exist ".env" (
    copy .env.example .env
    echo .env file created from .env.example
    echo IMPORTANT: Edit .env and set a secure API_KEY
) else (
    echo .env file already exists
)

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Edit .env file and set a secure API_KEY
echo 2. Run: venv\Scripts\activate.bat
echo 3. Run: python app.py
echo 4. Test: http://localhost:8080/health
echo.
echo For deployment to Railway, see README.md
echo.
pause
