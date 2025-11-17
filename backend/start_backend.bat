@echo off
echo Starting Python Backend Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher and try again
    pause
    exit /b 1
)

REM Check if required packages are installed
python -c "import flask" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing required packages...
    pip install flask flask-cors
    if %errorlevel% neq 0 (
        echo Error: Failed to install required packages
        pause
        exit /b 1
    )
)

REM Initialize database
echo Initializing database...
python init_db.py
if %errorlevel% neq 0 (
    echo Warning: Database initialization failed
)

REM Start the server
echo.
echo Starting Flask server...
echo The backend API will be available at http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python api.py

pause