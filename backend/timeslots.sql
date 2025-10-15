-- SQL file for storing time slots for resources
-- Table: time_slots
-- Stores available time slots for resources and their booking status

CREATE TABLE IF NOT EXISTS time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id INTEGER NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT 0,
    booking_id INTEGER,  -- Reference to booking if booked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE SET NULL
);

-- Index for faster queries on resource and date
CREATE INDEX IF NOT EXISTS idx_timeslots_resource_date ON time_slots(resource_id, date);

-- Initially empty - time slots will be generated dynamically based on bookings
-- The system will automatically calculate free time slots based on existing bookings