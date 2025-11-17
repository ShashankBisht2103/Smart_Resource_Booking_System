import requests

# Get all timetable entries
response = requests.get('http://localhost:5000/api/timetable')
data = response.json()

print("Sample timetable entries:")
for entry in data[:5]:
    print(f"  Day: {entry['day']}, Subject: {entry['subject_code']}, Time: {entry['time_start']}-{entry['time_end']}, Venue: {entry['venue']}")

# Get Monday entries specifically
print("\nMonday timetable entries:")
for entry in data:
    if entry['day'] == 'MON':
        print(f"  Subject: {entry['subject_code']}, Time: {entry['time_start']}-{entry['time_end']}, Venue: {entry['venue']}")