@echo off
echo ========================================
echo       Starting AI Backend Server
echo ========================================

echo Checking Python version...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.9 or higher from python.org.
    pause
    exit /b
)

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing dependencies...
cd backend
python -m pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies.
    echo Please check your internet connection or Python version.
    echo Google Gemini requires Python 3.9+.
    pause
    exit /b
)

echo.
echo Launching Application...
python app.py
pause
