#!/bin/bash

echo "Starting Python Backend Server..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Error: Python is not installed"
    echo "Please install Python 3.8 or higher and try again"
    exit 1
fi

# Check if required packages are installed
if ! python3 -c "import flask" &> /dev/null
then
    echo "Installing required packages..."
    pip install flask flask-cors requests
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install required packages"
        exit 1
    fi
fi

# Initialize database
echo "Initializing database..."
python3 init_db.py
if [ $? -ne 0 ]; then
    echo "Warning: Database initialization failed"
fi

# Start the server
echo
echo "Starting Flask server..."
echo "The backend API will be available at http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo
python3 api.py