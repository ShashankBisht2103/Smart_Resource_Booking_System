# Python Backend Implementation Summary

This document summarizes the Python backend implementation for the DBMS project.

## Files Created

### Backend Directory Structure
```
backend/
├── api.py              # Main Flask API server
├── init_db.py          # Database initialization script
├── reset_db.py         # Database reset script
├── check_backend.py    # Backend status check script
├── validate_setup.py   # Setup validation script
├── requirements.txt    # Python dependencies
├── start_backend.bat   # Windows startup script
├── start_backend.sh    # Unix/Linux/Mac startup script
├── test_api.py         # API testing script
├── README.md           # Backend documentation
├── resources.sql       # SQL schema for resources
├── bookings.sql        # SQL schema for bookings
├── timeslots.sql       # SQL schema for time slots
├── timetable.sql       # SQL schema for timetable
```

### SQL Files
1. **resources.sql** - Contains schema for resource types and resources
2. **bookings.sql** - Contains schema for booking information
3. **timeslots.sql** - Contains schema for time slot management
4. **timetable.sql** - Contains schema for timetable information

### Frontend Integration Files
1. **src/integrations/backend/client.ts** - TypeScript client for backend API

## Database Schema

### Resources System
- **resource_types**: Stores different types of resources (e.g., conference rooms, equipment)
- **resources**: Stores specific resources with their type, location, capacity, etc.

### Bookings System
- **bookings**: Stores all booking information including user, resource, time slot, and purpose

### Time Slots System
- **time_slots**: Manages available and booked time slots for resources

### Timetable System
- **subjects**: Stores subject information with faculty names
- **timetable**: Stores timetable entries with days, times, subjects, and venues

## API Endpoints

### Resources
- GET `/api/resources` - Get all resources
- POST `/api/resources` - Add a new resource
- DELETE `/api/resources/<id>` - Delete a resource
- GET `/api/resource-types` - Get all resource types

### Bookings
- GET `/api/bookings` - Get all bookings
- POST `/api/bookings` - Create a new booking
- DELETE `/api/bookings/<id>` - Cancel a booking

### Time Slots
- GET `/api/timeslots` - Get all time slots
- GET `/api/timeslots/resource/<resource_id>` - Get time slots for a specific resource
- POST `/api/timeslots` - Add a new time slot
- PUT `/api/timeslots/<id>` - Update a time slot (book/unbook)

### Timetable
- GET `/api/timetable` - Get all timetable entries
- GET `/api/timetable/today` - Get today's timetable entries

## How to Use

### Starting the Backend Server

#### Option 1: Manual Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Initialize the database: `python init_db.py`
4. Run the server: `python api.py`

#### Option 2: Windows Batch Script
1. Double-click `start_backend.bat` to automatically install dependencies and start the server

#### Option 3: Unix/Linux/Mac Shell Script
1. Run `start_backend.sh` to automatically install dependencies and start the server

### Testing the API
1. Run the test script: `python test_api.py`
2. Or use curl/postman to test endpoints directly

### Frontend Integration
1. Import functions from `src/integrations/backend/client.ts`
2. Use the provided functions to interact with the backend API

## Data Management

To manage your data:
1. Edit the SQL files directly to modify schema
2. Add sample data to the SQL files using INSERT statements
3. Run `python init_db.py` to reinitialize the database with your changes
4. The changes will be reflected in the frontend when you refresh the page

## Notes

- The backend uses SQLite for simplicity and easy deployment
- All data is stored in `database.db` in the backend directory
- The API runs on port 5000 by default
- CORS is enabled for frontend integration