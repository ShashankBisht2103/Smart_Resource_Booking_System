# Python Backend for DBMS Project

This directory contains the Python backend implementation for the DBMS project.

## Features
- RESTful API for resource management
- SQLite database with three tables:
  - Resources: Store resource types and specific resources
  - Bookings: Store booking information
  - TimeSlots: Manage available and booked time slots for resources

## Setup Instructions

### Option 1: Manual Setup

1. Install Python 3.8+
2. Install dependencies: `pip install -r requirements.txt`
3. Initialize the database: `python init_db.py`
4. Run the server: `python api.py`
5. The API will be available at `http://localhost:5000`

### Option 2: Windows Batch Script

1. Double-click `start_backend.bat` to automatically install dependencies and start the server
2. The API will be available at `http://localhost:5000`

### Option 3: Unix/Linux/Mac Script

1. Run `./start_backend.sh` to automatically install dependencies and start the server
2. The API will be available at `http://localhost:5000`

## Database Management

### Resetting the Database

To completely reset the database (delete all data and reinitialize):

1. Run `python reset_db.py`
2. This will delete the existing database file and create a new one with the schema

### Managing Data with SQL Files

See [SQL Usage Guide](./SQL_USAGE.md) for detailed instructions on how to manage your data by editing the SQL files directly.

## API Endpoints

### Resources
- GET `/api/resources` - Get all resources
- POST `/api/resources` - Add a new resource
- DELETE `/api/resources/<id>` - Delete a resource

### Bookings
- GET `/api/bookings` - Get all bookings
- POST `/api/bookings` - Create a new booking
- DELETE `/api/bookings/<id>` - Cancel a booking

### Time Slots
- GET `/api/timeslots` - Get all time slots
- GET `/api/timeslots/resource/<resource_id>` - Get time slots for a specific resource
- POST `/api/timeslots` - Add a new time slot
- PUT `/api/timeslots/<id>` - Update a time slot (book/unbook)