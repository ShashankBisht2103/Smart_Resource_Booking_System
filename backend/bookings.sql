-- SQL file for storing bookings
-- Table: bookings
-- Stores all booking information for resources

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,  -- In a real app, this would reference a users table
    user_name TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT,
    status TEXT DEFAULT 'confirmed',  -- confirmed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE
);

-- Index for faster queries on resource and time
CREATE INDEX IF NOT EXISTS idx_bookings_resource_time ON bookings(resource_id, start_time, end_time);

-- Initially empty - bookings will be added dynamically through the application