import sqlite3

# Connect to the database
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Clear existing Saturday entries
cursor.execute("DELETE FROM timetable WHERE day = 'SAT'")
print("Cleared existing Saturday entries")

# Add new Saturday entries
saturday_entries = [
    ('SAT', '09:00', '10:30', 'ELECTIVE', 'LT 201'),
    ('SAT', '11:00', '12:30', 'PROJECT BASED LEARNING', 'CR 204'),
    ('SAT', '14:00', '15:30', 'TCS 552', 'LT 302'),
    ('SAT', '16:00', '17:30', 'PESE 500', 'TCL 1')
]

cursor.executemany("INSERT INTO timetable (day, time_start, time_end, subject_code, venue) VALUES (?, ?, ?, ?, ?)", saturday_entries)
conn.commit()
print("Added new Saturday entries")

# Verify the entries
cursor.execute("SELECT * FROM timetable WHERE day = 'SAT'")
entries = cursor.fetchall()
print(f"\nSaturday timetable entries ({len(entries)}):")
for entry in entries:
    print(f"  {entry}")

conn.close()