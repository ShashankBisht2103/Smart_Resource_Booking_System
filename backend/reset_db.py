#!/usr/bin/env python3
"""
Script to reset the database (delete and reinitialize)
"""

import sqlite3
import os

def reset_database():
    # Database file path
    db_path = 'database.db'
    
    # Delete existing database file if it exists
    if os.path.exists(db_path):
        print(f"Deleting existing database file: {db_path}")
        os.remove(db_path)
    
    # Import and run initialization
    print("Reinitializing database...")
    try:
        # Connect to create new database
        conn = sqlite3.connect(db_path)
        conn.close()
        
        # Run initialization
        import init_db
        init_db.init_database()
        
        print("Database reset successfully!")
    except Exception as e:
        print(f"Error resetting database: {e}")

if __name__ == '__main__':
    reset_database()