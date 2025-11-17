import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta, date
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Database file path
DB_PATH = 'database.db'

# Initialize database with schema from SQL files
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Execute schema files
    schema_files = ['resources.sql', 'bookings.sql', 'timeslots.sql', 'timetable.sql']
    for filename in schema_files:
        filepath = os.path.join(os.path.dirname(__file__), filename)
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                # Read the entire file content
                sql_content = f.read()
                # Split by semicolon but be more careful
                sql_statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
                for statement in sql_statements:
                    # Skip empty statements or comments
                    if statement and not statement.startswith('--'):
                        try:
                            cursor.execute(statement)
                        except sqlite3.Error as e:
                            print(f"Error executing statement: {e}")
                            print(f"Statement: {statement}")
    
    conn.commit()
    conn.close()

# Helper function to get database connection
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    return conn

# Resources endpoints
@app.route('/api/resources', methods=['GET'])
def get_resources():
    conn = get_db_connection()
    resources = conn.execute('''
        SELECT r.*, rt.name as type_name 
        FROM resources r 
        JOIN resource_types rt ON r.type_id = rt.id
        ORDER BY r.type_id, r.name
    ''').fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    resources_list = [dict(row) for row in resources]
    return jsonify(resources_list)

@app.route('/api/resources/types', methods=['GET'])
def get_resource_types():
    conn = get_db_connection()
    types = conn.execute('SELECT * FROM resource_types ORDER BY name').fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    types_list = [dict(row) for row in types]
    return jsonify(types_list)

@app.route('/api/resources/by-type/<int:type_id>', methods=['GET'])
def get_resources_by_type(type_id):
    conn = get_db_connection()
    resources = conn.execute('''
        SELECT * FROM resources 
        WHERE type_id = ?
        ORDER BY name
    ''', (type_id,)).fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    resources_list = [dict(row) for row in resources]
    return jsonify(resources_list)

# Bookings endpoints
@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    conn = get_db_connection()
    bookings = conn.execute('''
        SELECT b.*, r.name as resource_name
        FROM bookings b
        JOIN resources r ON b.resource_id = r.id
        ORDER BY b.start_time DESC
    ''').fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    bookings_list = [dict(row) for row in bookings]
    return jsonify(bookings_list)

@app.route('/api/bookings/date/<date_str>', methods=['GET'])
def get_bookings_by_date(date_str):
    try:
        # Validate date format
        datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    conn = get_db_connection()
    bookings = conn.execute('''
        SELECT b.*, r.name as resource_name
        FROM bookings b
        JOIN resources r ON b.resource_id = r.id
        WHERE date(b.start_time) = ?
        ORDER BY b.start_time
    ''', (date_str,)).fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    bookings_list = [dict(row) for row in bookings]
    return jsonify(bookings_list)

@app.route('/api/bookings/resource/<int:resource_id>', methods=['GET'])
def get_bookings_for_resource(resource_id):
    date = request.args.get('date')
    
    conn = get_db_connection()
    
    if date:
        bookings = conn.execute('''
            SELECT * FROM bookings
            WHERE resource_id = ? AND date(start_time) = ?
            ORDER BY start_time
        ''', (resource_id, date)).fetchall()
    else:
        bookings = conn.execute('''
            SELECT * FROM bookings
            WHERE resource_id = ?
            ORDER BY start_time
        ''', (resource_id,)).fetchall()
    
    conn.close()
    
    # Convert to list of dictionaries
    bookings_list = [dict(row) for row in bookings]
    return jsonify(bookings_list)

@app.route('/api/bookings/resource/<int:resource_id>', methods=['DELETE'])
def cancel_all_bookings_for_resource(resource_id):
    # Get the user ID and role from the request headers
    user_id = request.headers.get('X-User-ID')
    user_role = request.headers.get('X-User-Role')
    
    # Only admins can cancel all bookings for a resource
    if user_role != 'admin':
        return jsonify({'error': 'Permission denied. Only admins can perform this action.'}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if resource exists
        resource = conn.execute('SELECT * FROM resources WHERE id = ?', (resource_id,)).fetchone()
        if not resource:
            conn.close()
            return jsonify({'error': 'Resource not found'}), 404
        
        # Get all bookings for this resource
        bookings = conn.execute('SELECT * FROM bookings WHERE resource_id = ?', (resource_id,)).fetchall()
        
        if not bookings:
            conn.close()
            return jsonify({'message': 'No bookings found for this resource'}), 200
        
        # Update all bookings for this resource to cancelled status
        cursor.execute('UPDATE bookings SET status = ? WHERE resource_id = ?', ('cancelled', resource_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': f'Successfully cancelled {len(bookings)} bookings for resource {resource["name"]}',
            'cancelled_bookings': len(bookings)
        })
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def add_booking():
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Validate required fields
        required_fields = ['resource_id', 'user_id', 'user_name', 'start_time', 'end_time']
        for field in required_fields:
            if field not in data or not data[field]:
                conn.close()
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse datetime strings
        start_time = datetime.fromisoformat(data['start_time'].replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        
        # Validate time constraints (8 AM to 6 PM)
        if start_time.hour < 8 or end_time.hour > 18 or (end_time.hour == 18 and end_time.minute > 0):
            conn.close()
            return jsonify({'error': 'Bookings must be between 8 AM and 6 PM'}), 400
        
        # Check if time slot is available
        overlapping = conn.execute('''
            SELECT COUNT(*) as count FROM bookings
            WHERE resource_id = ? AND status = 'confirmed' AND (
                (start_time < ? AND end_time > ?) OR
                (start_time < ? AND end_time > ?) OR
                (start_time >= ? AND end_time <= ?)
            )
        ''', (
            data['resource_id'],
            data['end_time'], data['start_time'],
            data['end_time'], data['start_time'],
            data['start_time'], data['end_time']
        )).fetchone()
        
        if overlapping['count'] > 0:
            conn.close()
            return jsonify({'error': 'Time slot already booked'}), 400
        
        cursor.execute('''
            INSERT INTO bookings (resource_id, user_id, user_name, start_time, end_time, purpose)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['resource_id'],
            data['user_id'],
            data['user_name'],
            data['start_time'],
            data['end_time'],
            data.get('purpose', '')
        ))
        
        booking_id = cursor.lastrowid
        
        # Get the created booking with resource name
        booking = conn.execute('''
            SELECT b.*, r.name as resource_name
            FROM bookings b
            JOIN resources r ON b.resource_id = r.id
            WHERE b.id = ?
        ''', (booking_id,)).fetchone()
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'id': booking_id,
            'message': 'Booking created successfully',
            'booking': dict(booking) if booking else None
        }), 201
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 400

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    # Get the user ID from the request headers (would be set by frontend)
    # In a real implementation, you would verify the user's identity and role
    user_id = request.headers.get('X-User-ID')
    user_role = request.headers.get('X-User-Role')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get booking details before deleting
        booking = conn.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,)).fetchone()
        if not booking:
            conn.close()
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user is admin or the booking owner
        is_admin = user_role == 'admin'
        is_owner = user_id == booking['user_id']
        
        if not is_admin and not is_owner:
            conn.close()
            return jsonify({'error': 'Permission denied. Only the booking owner or an admin can cancel this booking.'}), 403
        
        # Admins can cancel any booking, including their own
        # Regular users can only cancel their own bookings
        
        # Update booking status to cancelled instead of deleting
        cursor.execute('UPDATE bookings SET status = ? WHERE id = ?', ('cancelled', booking_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Booking cancelled successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 400

# Time slots endpoints
@app.route('/api/timeslots/<int:resource_id>', methods=['GET'])
def get_time_slots(resource_id):
    date_str = request.args.get('date')
    
    if not date_str:
        return jsonify({'error': 'Date parameter is required'}), 400
    
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    conn = get_db_connection()
    
    # Get all existing bookings for this resource on this date (including cancelled ones)
    bookings = conn.execute('''
        SELECT b.id, b.user_name, b.start_time, b.end_time, b.status
        FROM bookings b
        WHERE b.resource_id = ? AND date(b.start_time) = ?
        ORDER BY b.start_time
    ''', (resource_id, date_str)).fetchall()
    
    # Get timetable entries for this resource on this date
    day_name = date.strftime('%a').upper()[:3]  # MON, TUE, WED, etc.
    timetable_entries = conn.execute('''
        SELECT t.*, s.subject_name, s.faculty_name
        FROM timetable t
        JOIN subjects s ON t.subject_code = s.subject_code
        WHERE t.venue = (SELECT name FROM resources WHERE id = ?) AND t.day = ?
        ORDER BY t.time_start
    ''', (resource_id, day_name)).fetchall()
    
    conn.close()
    
    # Generate time slots according to the class schedule
    all_slots = []
    work_start = datetime.combine(date, datetime.min.time().replace(hour=8))
    work_end = datetime.combine(date, datetime.min.time().replace(hour=18))
    
    # Define the class schedule times (55-minute classes with breaks)
    # Morning schedule: 8:00-8:55, 8:55-9:50, 9:50-10:10 (break), 10:10-11:05, 11:05-12:00
    # Afternoon schedule: 12:00-12:55, 12:55-1:50, 1:50-2:10 (break), 2:10-3:05, 3:05-4:00, 4:00-4:55, 4:55-5:50
    class_schedule = [
        # Morning classes
        (datetime.combine(date, datetime.min.time().replace(hour=8, minute=0)), 
         datetime.combine(date, datetime.min.time().replace(hour=8, minute=55))),
        (datetime.combine(date, datetime.min.time().replace(hour=8, minute=55)), 
         datetime.combine(date, datetime.min.time().replace(hour=9, minute=50))),
        (datetime.combine(date, datetime.min.time().replace(hour=9, minute=50)), 
         datetime.combine(date, datetime.min.time().replace(hour=10, minute=10))),  # Break
        (datetime.combine(date, datetime.min.time().replace(hour=10, minute=10)), 
         datetime.combine(date, datetime.min.time().replace(hour=11, minute=5))),
        (datetime.combine(date, datetime.min.time().replace(hour=11, minute=5)), 
         datetime.combine(date, datetime.min.time().replace(hour=12, minute=0))),
        # Afternoon classes
        (datetime.combine(date, datetime.min.time().replace(hour=12, minute=0)), 
         datetime.combine(date, datetime.min.time().replace(hour=12, minute=55))),
        (datetime.combine(date, datetime.min.time().replace(hour=12, minute=55)), 
         datetime.combine(date, datetime.min.time().replace(hour=13, minute=50))),
        (datetime.combine(date, datetime.min.time().replace(hour=13, minute=50)), 
         datetime.combine(date, datetime.min.time().replace(hour=14, minute=10))),  # Break
        (datetime.combine(date, datetime.min.time().replace(hour=14, minute=10)), 
         datetime.combine(date, datetime.min.time().replace(hour=15, minute=5))),
        (datetime.combine(date, datetime.min.time().replace(hour=15, minute=5)), 
         datetime.combine(date, datetime.min.time().replace(hour=16, minute=0))),
        (datetime.combine(date, datetime.min.time().replace(hour=16, minute=0)), 
         datetime.combine(date, datetime.min.time().replace(hour=16, minute=55))),
        (datetime.combine(date, datetime.min.time().replace(hour=16, minute=55)), 
         datetime.combine(date, datetime.min.time().replace(hour=17, minute=50)))
    ]
    
    # Convert bookings to datetime objects
    booked_periods = []
    for booking in bookings:
        # Only include confirmed bookings
        if booking['status'] == 'confirmed':
            start = datetime.fromisoformat(booking['start_time'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(booking['end_time'].replace('Z', '+00:00'))
            booked_periods.append({
                'booking_id': booking['id'],
                'user_name': booking['user_name'],
                'start': start,
                'end': end,
                'status': booking['status'],
                'type': 'booking'
            })
    
    # Convert timetable entries to datetime objects
    timetable_periods = []
    for entry in timetable_entries:
        # Convert time strings to datetime objects for today
        time_start = datetime.strptime(entry['time_start'], '%H:%M').time()
        time_end = datetime.strptime(entry['time_end'], '%H:%M').time()
        start = datetime.combine(date, time_start)
        end = datetime.combine(date, time_end)
        
        timetable_periods.append({
            'subject_code': entry['subject_code'],
            'subject_name': entry['subject_name'],
            'faculty_name': entry['faculty_name'],
            'start': start,
            'end': end,
            'type': 'timetable'
        })
    
    # Generate slots according to the class schedule
    for slot_start, slot_end in class_schedule:
        # Check if this slot overlaps with any booking
        is_booked = False
        booking_info = None
        for period in booked_periods:
            # Ensure both datetime objects are offset-naive for comparison
            period_start = period['start'].replace(tzinfo=None) if period['start'].tzinfo else period['start']
            period_end = period['end'].replace(tzinfo=None) if period['end'].tzinfo else period['end']
            slot_current = slot_start.replace(tzinfo=None) if slot_start.tzinfo else slot_start
            slot_end_normalized = slot_end.replace(tzinfo=None) if slot_end.tzinfo else slot_end
            
            if (slot_current < period_end and slot_end_normalized > period_start):
                is_booked = True
                booking_info = {
                    'booking_id': period['booking_id'],
                    'user_name': period['user_name'],
                    'type': 'booking'
                }
                break
        
        # Check if this slot overlaps with any timetable entry
        is_timetable = False
        timetable_info = None
        for period in timetable_periods:
            # Ensure both datetime objects are offset-naive for comparison
            period_start = period['start'].replace(tzinfo=None) if period['start'].tzinfo else period['start']
            period_end = period['end'].replace(tzinfo=None) if period['end'].tzinfo else period['end']
            slot_current = slot_start.replace(tzinfo=None) if slot_start.tzinfo else slot_start
            slot_end_normalized = slot_end.replace(tzinfo=None) if slot_end.tzinfo else slot_end
            
            if (slot_current < period_end and slot_end_normalized > period_start):
                is_timetable = True
                timetable_info = {
                    'subject_code': period['subject_code'],
                    'subject_name': period['subject_name'],
                    'faculty_name': period['faculty_name'],
                    'type': 'timetable'
                }
                break
        
        # Calculate duration in minutes
        duration_minutes = int((slot_end - slot_start).total_seconds() / 60)
        duration_text = f"{duration_minutes} minutes"
        
        slot_info = {
            'start_time': slot_start.isoformat(),
            'end_time': slot_end.isoformat(),
            'duration': duration_text,
            'is_booked': is_booked,
            'is_timetable': is_timetable,
            'booking_info': booking_info,
            'timetable_info': timetable_info
        }
        
        all_slots.append(slot_info)
    
    return jsonify(all_slots)

@app.route('/api/timeslots/free/<int:resource_id>', methods=['GET'])
def get_free_time_slots(resource_id):
    date_str = request.args.get('date')
    
    if not date_str:
        return jsonify({'error': 'Date parameter is required'}), 400
    
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    conn = get_db_connection()
    
    # Get all existing bookings for this resource on this date
    bookings = conn.execute('''
        SELECT start_time, end_time FROM bookings
        WHERE resource_id = ? AND date(start_time) = ? AND status = 'confirmed'
        ORDER BY start_time
    ''', (resource_id, date_str)).fetchall()
    
    # Get timetable entries for this resource on this date
    day_name = date.strftime('%a').upper()[:3]  # MON, TUE, WED, etc.
    timetable_entries = conn.execute('''
        SELECT time_start, time_end
        FROM timetable
        WHERE venue = (SELECT name FROM resources WHERE id = ?) AND day = ?
        ORDER BY time_start
    ''', (resource_id, day_name)).fetchall()
    
    conn.close()
    
    # Generate free time slots according to the class schedule
    free_slots = []
    
    # Define the class schedule times (55-minute classes with breaks)
    class_schedule = [
        # Morning classes
        (datetime.combine(date, datetime.min.time().replace(hour=8, minute=0)), 
         datetime.combine(date, datetime.min.time().replace(hour=8, minute=55))),
        (datetime.combine(date, datetime.min.time().replace(hour=8, minute=55)), 
         datetime.combine(date, datetime.min.time().replace(hour=9, minute=50))),
        (datetime.combine(date, datetime.min.time().replace(hour=9, minute=50)), 
         datetime.combine(date, datetime.min.time().replace(hour=10, minute=10))),  # Break
        (datetime.combine(date, datetime.min.time().replace(hour=10, minute=10)), 
         datetime.combine(date, datetime.min.time().replace(hour=11, minute=5))),
        (datetime.combine(date, datetime.min.time().replace(hour=11, minute=5)), 
         datetime.combine(date, datetime.min.time().replace(hour=12, minute=0))),
        # Afternoon classes
        (datetime.combine(date, datetime.min.time().replace(hour=12, minute=0)), 
         datetime.combine(date, datetime.min.time().replace(hour=12, minute=55))),
        (datetime.combine(date, datetime.min.time().replace(hour=12, minute=55)), 
         datetime.combine(date, datetime.min.time().replace(hour=13, minute=50))),
        (datetime.combine(date, datetime.min.time().replace(hour=13, minute=50)), 
         datetime.combine(date, datetime.min.time().replace(hour=14, minute=10))),  # Break
        (datetime.combine(date, datetime.min.time().replace(hour=14, minute=10)), 
         datetime.combine(date, datetime.min.time().replace(hour=15, minute=5))),
        (datetime.combine(date, datetime.min.time().replace(hour=15, minute=5)), 
         datetime.combine(date, datetime.min.time().replace(hour=16, minute=0))),
        (datetime.combine(date, datetime.min.time().replace(hour=16, minute=0)), 
         datetime.combine(date, datetime.min.time().replace(hour=16, minute=55))),
        (datetime.combine(date, datetime.min.time().replace(hour=16, minute=55)), 
         datetime.combine(date, datetime.min.time().replace(hour=17, minute=50)))
    ]
    
    # Convert bookings to datetime objects
    booked_periods = []
    for booking in bookings:
        start = datetime.fromisoformat(booking['start_time'].replace('Z', '+00:00'))
        end = datetime.fromisoformat(booking['end_time'].replace('Z', '+00:00'))
        booked_periods.append((start, end))
    
    # Convert timetable entries to datetime objects
    for entry in timetable_entries:
        time_start = datetime.strptime(entry['time_start'], '%H:%M').time()
        time_end = datetime.strptime(entry['time_end'], '%H:%M').time()
        start = datetime.combine(date, time_start)
        end = datetime.combine(date, time_end)
        booked_periods.append((start, end))
    
    # Check for free slots according to the class schedule
    for slot_start, slot_end in class_schedule:
        # Check if this slot overlaps with any booking or timetable
        is_free = True
        for start, end in booked_periods:
            # Ensure both datetime objects are offset-naive for comparison
            period_start = start.replace(tzinfo=None) if start.tzinfo else start
            period_end = end.replace(tzinfo=None) if end.tzinfo else end
            slot_current = slot_start.replace(tzinfo=None) if slot_start.tzinfo else slot_start
            slot_end_normalized = slot_end.replace(tzinfo=None) if slot_end.tzinfo else slot_end
            
            if (slot_current < period_end and slot_end_normalized > period_start):
                is_free = False
                break
        
        if is_free:
            # Calculate duration in minutes
            duration_minutes = int((slot_end - slot_start).total_seconds() / 60)
            duration_text = f"{duration_minutes} minutes"
            
            free_slots.append({
                'start_time': slot_start.isoformat(),
                'end_time': slot_end.isoformat(),
                'duration': duration_text
            })
    
    return jsonify(free_slots)

@app.route('/api/timeslots/booked', methods=['GET'])
def get_all_booked_time_slots():
    date_str = request.args.get('date')
    
    if not date_str:
        return jsonify({'error': 'Date parameter is required'}), 400
    
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    conn = get_db_connection()
    
    # Get all confirmed bookings for this date
    bookings = conn.execute('''
        SELECT b.id, b.user_name, b.start_time, b.end_time, b.status, r.name as resource_name
        FROM bookings b
        JOIN resources r ON b.resource_id = r.id
        WHERE date(b.start_time) = ? AND b.status = 'confirmed'
        ORDER BY r.name, b.start_time
    ''', (date_str,)).fetchall()
    
    # Get all timetable entries for this date
    day_name = date.strftime('%a').upper()[:3]  # MON, TUE, WED, etc.
    timetable_entries = conn.execute('''
        SELECT t.*, s.subject_name, s.faculty_name, r.id as resource_id, r.name as resource_name
        FROM timetable t
        JOIN subjects s ON t.subject_code = s.subject_code
        JOIN resources r ON t.venue = r.name
        WHERE t.day = ?
        ORDER BY r.name, t.time_start
    ''', (day_name,)).fetchall()
    
    conn.close()
    
    # Convert bookings to list of dictionaries
    booked_slots = []
    for booking in bookings:
        booked_slots.append({
            'booking_id': booking['id'],
            'user_name': booking['user_name'],
            'resource_name': booking['resource_name'],
            'resource_id': booking['resource_id'] if 'resource_id' in booking.keys() else None,
            'start_time': booking['start_time'],
            'end_time': booking['end_time'],
            'status': booking['status'],
            'type': 'booking'
        })
    
    # Convert timetable entries to list of dictionaries
    for entry in timetable_entries:
        # Convert time strings to datetime objects for today
        time_start = datetime.strptime(entry['time_start'], '%H:%M').time()
        time_end = datetime.strptime(entry['time_end'], '%H:%M').time()
        start = datetime.combine(date, time_start)
        end = datetime.combine(date, time_end)
        
        booked_slots.append({
            'subject_code': entry['subject_code'],
            'subject_name': entry['subject_name'],
            'faculty_name': entry['faculty_name'],
            'resource_name': entry['resource_name'],
            'resource_id': entry['resource_id'],
            'start_time': start.isoformat(),
            'end_time': end.isoformat(),
            'type': 'timetable'
        })
    
    # Sort all slots by start time
    booked_slots.sort(key=lambda x: x['start_time'])
    
    return jsonify(booked_slots)

# New endpoint to get available resources for a specific time slot
@app.route('/api/resources/available', methods=['GET'])
def get_available_resources():
    date_str = request.args.get('date')
    start_time_str = request.args.get('start_time')
    end_time_str = request.args.get('end_time')
    
    if not date_str or not start_time_str or not end_time_str:
        return jsonify({'error': 'Date, start_time, and end_time parameters are required'}), 400
    
    try:
        # Parse the date
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Parse the time strings
        start_time = datetime.strptime(start_time_str, '%H:%M').time()
        end_time = datetime.strptime(end_time_str, '%H:%M').time()
        
        # Combine date and time
        start_datetime = datetime.combine(date, start_time)
        end_datetime = datetime.combine(date, end_time)
    except ValueError as e:
        return jsonify({'error': f'Invalid date/time format: {str(e)}'}), 400
    
    conn = get_db_connection()
    
    # Get all resources
    resources = conn.execute('''
        SELECT r.*, rt.name as type_name 
        FROM resources r 
        JOIN resource_types rt ON r.type_id = rt.id
        ORDER BY r.type_id, r.name
    ''').fetchall()
    
    # Get all bookings that overlap with the requested time slot
    overlapping_bookings = conn.execute('''
        SELECT b.resource_id
        FROM bookings b
        WHERE b.status = 'confirmed' AND date(b.start_time) = ? AND (
            (b.start_time < ? AND b.end_time > ?) OR
            (b.start_time < ? AND b.end_time > ?) OR
            (b.start_time >= ? AND b.end_time <= ?)
        )
    ''', (
        date_str,
        end_datetime.isoformat(),
        start_datetime.isoformat(),
        end_datetime.isoformat(),
        start_datetime.isoformat(),
        start_datetime.isoformat(),
        end_datetime.isoformat()
    )).fetchall()
    
    # Get all timetable entries for the day that overlap with the requested time slot
    day_name = date.strftime('%a').upper()[:3]  # MON, TUE, WED, etc.
    timetable_entries = conn.execute('''
        SELECT r.id as resource_id
        FROM timetable t
        JOIN resources r ON t.venue = r.name
        WHERE t.day = ? AND (
            (time(t.time_start) < ? AND time(t.time_end) > ?) OR
            (time(t.time_start) < ? AND time(t.time_end) > ?) OR
            (time(t.time_start) >= ? AND time(t.time_end) <= ?)
        )
    ''', (
        day_name,
        end_time_str,
        start_time_str,
        end_time_str,
        start_time_str,
        start_time_str,
        end_time_str
    )).fetchall()
    
    conn.close()
    
    # Create sets of unavailable resource IDs
    booked_resource_ids = {row['resource_id'] for row in overlapping_bookings}
    timetable_resource_ids = {row['resource_id'] for row in timetable_entries}
    unavailable_resource_ids = booked_resource_ids.union(timetable_resource_ids)
    
    # Filter available resources (those not in either set)
    available_resources = [
        dict(row) for row in resources 
        if row['id'] not in unavailable_resource_ids
    ]
    
    return jsonify(available_resources)

# Timetable endpoints
@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    conn = get_db_connection()
    timetable = conn.execute('''
        SELECT t.*, s.subject_name, s.faculty_name, r.id as resource_id
        FROM timetable t
        JOIN subjects s ON t.subject_code = s.subject_code
        JOIN resources r ON t.venue = r.name
        ORDER BY t.section, t.day, t.time_start
    ''').fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    timetable_list = [dict(row) for row in timetable]
    return jsonify(timetable_list)

@app.route('/api/timetable/today', methods=['GET'])
def get_today_timetable():
    today = date.today()
    day_name = today.strftime('%a').upper()[:3]  # MON, TUE, WED, etc.
    
    conn = get_db_connection()
    timetable = conn.execute('''
        SELECT t.*, s.subject_name, s.faculty_name, r.id as resource_id
        FROM timetable t
        JOIN subjects s ON t.subject_code = s.subject_code
        JOIN resources r ON t.venue = r.name
        WHERE t.day = ?
        ORDER BY t.section, t.time_start
    ''', (day_name,)).fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    timetable_list = [dict(row) for row in timetable]
    return jsonify(timetable_list)

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run the app
    app.run(host='0.0.0.0', port=5000, debug=True)