# SQL Files Usage Guide

This document explains how to use the SQL files to manage your data directly.

## Overview

The backend uses three SQL files that define the database schema and initial data:

1. `resources.sql` - Defines resource types and resources
2. `bookings.sql` - Defines booking records
3. `timeslots.sql` - Defines time slots for resources

## Adding Data

To add new data to your database:

1. Open the appropriate SQL file
2. Add new INSERT statements for your data
3. Save the file
4. Reinitialize the database by running:
   - `python init_db.py` (to update without deleting existing data)
   - `python reset_db.py` (to completely reset and reinitialize)

## Example: Adding a New Resource Type

In `resources.sql`, find the section with sample data:

```sql
-- Sample data for resource types
INSERT OR IGNORE INTO resource_types (name, description) VALUES 
('Conference Room', 'Meeting rooms for team collaboration'),
('Equipment', 'Technical equipment for presentations and work'),
('Vehicle', 'Company vehicles for business use');
```

Add your new resource type:

```sql
-- Sample data for resource types
INSERT OR IGNORE INTO resource_types (name, description) VALUES 
('Conference Room', 'Meeting rooms for team collaboration'),
('Equipment', 'Technical equipment for presentations and work'),
('Vehicle', 'Company vehicles for business use'),
('Lab', 'Research laboratories');
```

## Example: Adding a New Resource

In `resources.sql`, find the section with sample resources:

```sql
-- Sample data for resources
INSERT OR IGNORE INTO resources (type_id, name, description, location, capacity) VALUES 
(1, 'Room A', 'Large conference room with video conferencing', 'Floor 3', 20),
(1, 'Room B', 'Small meeting room', 'Floor 2', 6),
(2, 'Projector 1', 'High-resolution projector', 'Storage Room 1', 1),
(2, 'Laptop 1', 'Business laptop', 'Storage Room 2', 1);
```

Add your new resource:

```sql
-- Sample data for resources
INSERT OR IGNORE INTO resources (type_id, name, description, location, capacity) VALUES 
(1, 'Room A', 'Large conference room with video conferencing', 'Floor 3', 20),
(1, 'Room B', 'Small meeting room', 'Floor 2', 6),
(2, 'Projector 1', 'High-resolution projector', 'Storage Room 1', 1),
(2, 'Laptop 1', 'Business laptop', 'Storage Room 2', 1),
(4, 'Bio Lab', 'Biological research laboratory', 'Building B', 10);
```

## Example: Adding a New Booking

In `bookings.sql`, find the sample data section:

```sql
-- Sample data for bookings
INSERT OR IGNORE INTO bookings (resource_id, user_id, user_name, start_time, end_time, purpose) VALUES 
(1, 'user001', 'John Doe', '2025-10-15 09:00:00', '2025-10-15 11:00:00', 'Team Meeting'),
(2, 'user002', 'Jane Smith', '2025-10-16 14:00:00', '2025-10-16 15:00:00', 'Client Presentation');
```

Add your new booking:

```sql
-- Sample data for bookings
INSERT OR IGNORE INTO bookings (resource_id, user_id, user_name, start_time, end_time, purpose) VALUES 
(1, 'user001', 'John Doe', '2025-10-15 09:00:00', '2025-10-15 11:00:00', 'Team Meeting'),
(2, 'user002', 'Jane Smith', '2025-10-16 14:00:00', '2025-10-16 15:00:00', 'Client Presentation'),
(5, 'user003', 'Bob Johnson', '2025-10-17 10:00:00', '2025-10-17 12:00:00', 'Research Experiment');
```

## Example: Adding Time Slots

In `timeslots.sql`, find the sample data section:

```sql
-- Sample data for time slots
INSERT OR IGNORE INTO time_slots (resource_id, date, start_time, end_time, is_booked) VALUES 
(1, '2025-10-15', '09:00:00', '10:00:00', 1),
(1, '2025-10-15', '10:00:00', '11:00:00', 1),
(1, '2025-10-15', '11:00:00', '12:00:00', 0),
(2, '2025-10-16', '14:00:00', '15:00:00', 1),
(2, '2025-10-16', '15:00:00', '16:00:00', 0);
```

Add your new time slots:

```sql
-- Sample data for time slots
INSERT OR IGNORE INTO time_slots (resource_id, date, start_time, end_time, is_booked) VALUES 
(1, '2025-10-15', '09:00:00', '10:00:00', 1),
(1, '2025-10-15', '10:00:00', '11:00:00', 1),
(1, '2025-10-15', '11:00:00', '12:00:00', 0),
(2, '2025-10-16', '14:00:00', '15:00:00', 1),
(2, '2025-10-16', '15:00:00', '16:00:00', 0),
(5, '2025-10-17', '10:00:00', '11:00:00', 1),
(5, '2025-10-17', '11:00:00', '12:00:00', 1);
```

## Applying Changes

After modifying any SQL file, you need to apply the changes to the database:

### Option 1: Update without deleting existing data
Run `python init_db.py` to reinitialize the database with your new data while preserving existing records.

### Option 2: Complete reset (deletes all data)
Run `python reset_db.py` to completely reset the database and reinitialize it with your schema and data.

## Viewing Data

To view the current data in your database, you can use any SQLite browser or command-line tool:

```bash
sqlite3 database.db
.tables
SELECT * FROM resources;
SELECT * FROM bookings;
SELECT * FROM time_slots;
```

## Notes

- The `INSERT OR IGNORE` statement prevents duplicate entries when reinitializing
- Changes to the database schema (CREATE TABLE statements) require a complete reset
- The database file is named `database.db` and is located in the backend directory
- All timestamps should be in ISO format (YYYY-MM-DD HH:MM:SS)