#!/usr/bin/env python3
"""
Script to initialize the database with schema and sample data
"""

import sqlite3
import os

def execute_sql_file(cursor, filepath):
    """Execute SQL statements from a file"""
    if not os.path.exists(filepath):
        print(f"Schema file {filepath} not found")
        return 0
    
    print(f"Executing {os.path.basename(filepath)}...")
    with open(filepath, 'r') as f:
        content = f.read()
        # Split by semicolon and execute each statement
        sql_statements = content.split(';')
        executed = 0
        for statement in sql_statements:
            statement = statement.strip()
            if statement and not (statement.startswith('--') and '\n' not in statement):
                # Check if this is a statement that contains both comments and SQL
                if statement.startswith('--') and '\n' in statement:
                    # Extract the SQL part after the comments
                    lines = statement.split('\n')
                    sql_lines = [line for line in lines if not line.strip().startswith('--')]
                    sql_part = '\n'.join(sql_lines).strip()
                    if sql_part:
                        try:
                            cursor.execute(sql_part)
                            executed += 1
                        except sqlite3.Error as e:
                            print(f"Warning: {e}")
                elif not statement.startswith('--'):
                    try:
                        cursor.execute(statement)
                        executed += 1
                    except sqlite3.Error as e:
                        print(f"Warning: {e}")
        print(f"  Executed {executed} statements from {os.path.basename(filepath)}")
        return executed

def init_database():
    # Database file path
    db_path = 'database.db'
    
    # Remove existing database
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Initializing database...")
    
    # Execute schema files
    schema_files = ['resources.sql', 'bookings.sql', 'timeslots.sql', 'timetable.sql']
    for filename in schema_files:
        filepath = os.path.join(os.path.dirname(__file__), filename)
        execute_sql_file(cursor, filepath)
    
    conn.commit()
    conn.close()
    
    print(f"Database initialized successfully at {db_path}")

if __name__ == '__main__':
    init_database()