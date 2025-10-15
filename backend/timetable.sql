-- SQL file for storing timetable information
-- Table: subjects
-- Stores subject information with faculty names

CREATE TABLE IF NOT EXISTS subjects (
    subject_code VARCHAR(10) PRIMARY KEY,
    subject_name VARCHAR(150),
    faculty_name VARCHAR(150)
);

-- Insert subjects with faculty
INSERT OR REPLACE INTO subjects VALUES
('TCS 509', 'Machine Learning', 'MS. RICHA GUPTA'),
('TCS 502', 'Operating Systems', 'DR. SEEMA GULATI'),
('TCS 503', 'Data Base Management Systems', 'MR. MUKESH KUMAR'),
('TCS 514', 'Computer Networks I', 'MS. RICHA GUPTA'),
('TCS 584', 'Foundations of Quantum Computing', 'DR. SUSHEELA DAHIYA'),
('TCS 552', 'Cloud Based Application Development and Management', 'DR. PRAKASH SRIVASTAVA'),
('TCS 571', 'Bigdata Visualization', 'DR. PRABHDEEP SINGH'),
('TCS 591', 'Computer System Security', 'MS. SONAL MALHOTRA'),
('TCS 593', 'Deep Learning Fundamentals', 'DR. SUSHEELA DAHIYA'),
('TCS 595', 'Security Audit & Compliance I', 'DR. SAUMITRA CHATTOPADHYAY'),
('CEC', 'Career Excellence Classes', 'MS. AYUSHI JAIN'),
('XCS 501', 'Career Skills', 'MR. ANURAG CHAUHAN'),
('PCS 502', 'Operating Systems Lab', 'DR. SEEMA GULATI'),
('PCS 503', 'DBMS Lab', 'MR. MUKESH KUMAR'),
('PCS 514', 'Computer Networks I Lab', 'MS. NEHA POKHRIYAL'),
('PESE 500', 'Practical for Employability Skill Development', 'DR. ANIMESH SHARMA'),
('PROJECT BASED LEARNING', 'Project Based Learning', ''),
('ELECTIVE', 'Elective Subject', '');

-- Table: timetable
-- Stores timetable entries with days, times, subjects, and venues

CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day VARCHAR(10),
    time_start TIME,
    time_end TIME,
    subject_code VARCHAR(10),
    venue VARCHAR(50)
);

-- Insert timetable entries for all days with venues mapped to actual resources
-- Monday
INSERT OR REPLACE INTO timetable (day, time_start, time_end, subject_code, venue) VALUES
('MON', '08:00', '08:55', 'PCS 514', 'TCL 2'),
('MON', '08:55', '09:50', 'PCS 503', 'TCL 2'),
('MON', '10:10', '11:05', 'TCS 503', 'LT 201'),
('MON', '11:05', '12:00', 'TCS 502', 'LT 202'),
('MON', '12:00', '12:55', 'PROJECT BASED LEARNING', 'CR 204'),
('MON', '12:55', '13:50', 'ELECTIVE', 'CR 205'),
('MON', '14:10', '15:05', 'TCS 584', 'LT 301'),
('MON', '15:05', '16:00', 'TCS 571', 'LT 302'),
('MON', '16:00', '16:55', 'TCS 595', 'CR 206');

-- Tuesday
INSERT OR REPLACE INTO timetable (day, time_start, time_end, subject_code, venue) VALUES
('TUE', '08:00', '08:55', 'CEC', 'LT 201'),
('TUE', '08:55', '09:50', 'TCS 514', 'LT 301'),
('TUE', '10:10', '11:05', 'PCS 502', 'TCL 1'),
('TUE', '11:05', '12:00', 'PCS 503', 'LAB 9'),
('TUE', '12:55', '13:50', 'TCS 509', 'LT 201'),
('TUE', '14:10', '15:05', 'ELECTIVE', 'CR 201'),
('TUE', '15:05', '16:00', 'TCS 584', 'LT 302'),
('TUE', '16:00', '16:55', 'TCS 571', 'CR 202'),
('TUE', '16:55', '17:50', 'TCS 595', 'CR 203');

-- Wednesday
INSERT OR REPLACE INTO timetable (day, time_start, time_end, subject_code, venue) VALUES
('WED', '08:00', '08:55', 'CEC', 'LT 201'),
('WED', '10:10', '11:05', 'TCS 503', 'LT 201'),
('WED', '11:05', '12:00', 'TCS 514', 'LT 302'),
('WED', '12:00', '12:55', 'XCS 501', 'CR 206'),
('WED', '12:55', '13:50', 'TCS 502', 'LT 302'),
('WED', '14:10', '15:05', 'TCS 509', 'LT 301');

-- Thursday
INSERT OR REPLACE INTO timetable (day, time_start, time_end, subject_code, venue) VALUES
('THU', '08:00', '08:55', 'PCS 514', 'TCL 3'),
('THU', '10:10', '11:05', 'TCS 509', 'CR 204'),
('THU', '11:05', '12:00', 'TCS 514', 'CR 202'),
('THU', '12:55', '13:50', 'TCS 503', 'LT 301'),
('THU', '15:05', '16:00', 'ELECTIVE', 'CR 201'),
('THU', '16:00', '16:55', 'TCS 552', 'LT 202'),
('THU', '16:55', '17:50', 'ELECTIVE', 'CR 203');

-- Friday
INSERT OR REPLACE INTO timetable (day, time_start, time_end, subject_code, venue) VALUES
('FRI', '08:00', '08:55', 'CEC', 'LT 201'),
('FRI', '08:55', '09:50', 'TCS 509', 'CR 202'),
('FRI', '10:10', '11:05', 'TCS 502', 'CR 204'),
('FRI', '12:00', '12:55', 'TCS 514', 'CR 202'),
('FRI', '14:10', '15:05', 'PCS 502', 'TCL 3'),
('FRI', '16:00', '16:55', 'TCS 593', 'LT 301'),
('FRI', '16:55', '17:50', 'TCS 591', 'LT 302');

-- Saturday
INSERT OR REPLACE INTO timetable (day, time_start, time_end, subject_code, venue) VALUES
('SAT', '09:00', '10:30', 'ELECTIVE', 'LT 201'),
('SAT', '11:00', '12:30', 'PROJECT BASED LEARNING', 'CR 204'),
('SAT', '14:00', '15:30', 'TCS 552', 'LT 302'),
('SAT', '16:00', '17:30', 'PESE 500', 'TCL 1');

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_timetable_day ON timetable(day);
CREATE INDEX IF NOT EXISTS idx_timetable_venue ON timetable(venue);