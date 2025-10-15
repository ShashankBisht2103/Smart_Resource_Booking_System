-- SQL file for storing resource types and specific resources
-- Table: resource_types
-- Stores different types of resources (e.g., conference rooms, equipment, vehicles)

CREATE TABLE IF NOT EXISTS resource_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: resources
-- Stores specific resources with their type

CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    capacity INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES resource_types (id) ON DELETE CASCADE
);

-- Insert resource types
INSERT OR REPLACE INTO resource_types (id, name, description) VALUES 
(1, 'Lecture Theatre', 'Lecture theatres for large gatherings'),
(2, 'Classroom', 'Classrooms for regular classes'),
(3, 'Lab/TCL', 'Laboratories and computer labs'),
(4, 'Other', 'Other venues and facilities');

-- Insert specific resources for Lecture Theatres (capacity 250-300)
INSERT OR REPLACE INTO resources (id, type_id, name, description, location, capacity) VALUES 
(1, 1, 'LT 201', 'Lecture Theatre 201', 'Building A', 300),
(2, 1, 'LT 202', 'Lecture Theatre 202', 'Building A', 250),
(3, 1, 'LT 301', 'Lecture Theatre 301', 'Building B', 300),
(4, 1, 'LT 302', 'Lecture Theatre 302', 'Building B', 250);

-- Insert specific resources for Classrooms (capacity 80)
INSERT OR REPLACE INTO resources (id, type_id, name, description, location, capacity) VALUES 
(5, 2, 'CR 104', 'Classroom 104', 'Building C', 80),
(6, 2, 'CR 201', 'Classroom 201', 'Building C', 80),
(7, 2, 'CR 202', 'Classroom 202', 'Building C', 80),
(8, 2, 'CR 203', 'Classroom 203', 'Building C', 80),
(9, 2, 'CR 204', 'Classroom 204', 'Building C', 80),
(10, 2, 'CR 205', 'Classroom 205', 'Building C', 80),
(11, 2, 'CR 206', 'Classroom 206', 'Building C', 80),
(12, 2, 'CR 207', 'Classroom 207', 'Building C', 80);

-- Insert specific resources for Labs/TCL (capacity 80-100)
INSERT OR REPLACE INTO resources (id, type_id, name, description, location, capacity) VALUES 
(13, 3, 'LAB 1', 'Science Laboratory 1', 'Building D', 80),
(14, 3, 'LAB 3', 'Science Laboratory 3', 'Building D', 80),
(15, 3, 'LAB 9', 'Science Laboratory 9', 'Building D', 80),
(16, 3, 'TCL 1', 'Computer Lab 1', 'Building E', 90),
(17, 3, 'TCL 2', 'Computer Lab 2', 'Building E', 90),
(18, 3, 'TCL 3', 'Computer Lab 3', 'Building E', 100),
(19, 3, 'TCL 4', 'Computer Lab 4', 'Building E', 100),
(20, 3, 'UBUNTU LAB 1', 'Ubuntu Computer Lab 1', 'Building E', 95),
(21, 3, 'UBUNTU LAB 2', 'Ubuntu Computer Lab 2', 'Building E', 95);

-- Insert specific resources for Others
INSERT OR REPLACE INTO resources (id, type_id, name, description, location, capacity) VALUES 
(22, 4, 'VENUE 1', 'General Venue 1', 'Building F', 50),
(23, 4, 'VENUE 2', 'General Venue 2', 'Building F', 50),
(24, 4, 'KP NAUTIYAL AUDITORIUM', 'Auditorium KP Nautiyal', 'Main Building', 500),
(25, 4, 'NEW AUDITORIUM', 'New Auditorium', 'Main Building', 500),
(26, 4, 'GROUND', 'Sports Ground', 'Outdoor Area', 200),
(27, 4, 'BASKET BALL COURT', 'Basketball Court', 'Sports Complex', 20),
(28, 4, 'BADMINTON COURT', 'Badminton Court', 'Sports Complex', 10),
(29, 4, 'TABLE TENNIS 1', 'Table Tennis Table 1', 'Sports Complex', 4),
(30, 4, 'TABLE TENNIS 2', 'Table Tennis Table 2', 'Sports Complex', 4),
(31, 4, 'VOLLEYBALL COURT', 'Volleyball Court', 'Sports Complex', 15);