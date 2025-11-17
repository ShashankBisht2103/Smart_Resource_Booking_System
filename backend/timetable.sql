-- SQL file for storing timetable information
-- Table: subjects
-- Stores subject information with faculty names

CREATE TABLE IF NOT EXISTS subjects (
<<<<<<< HEAD
    subject_code VARCHAR(20) PRIMARY KEY,
=======
    subject_code VARCHAR(10) PRIMARY KEY,
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
    subject_name VARCHAR(150),
    faculty_name VARCHAR(150)
);

-- Insert subjects with faculty
INSERT OR REPLACE INTO subjects VALUES
('TCS 509', 'Machine Learning', 'MS. RICHA GUPTA'),
<<<<<<< HEAD
('TCS 509_ALT1', 'Machine Learning', 'DR. AMIT GUPTA'),
('TCS 509_ALT2', 'Machine Learning', 'MS. RICHA GUPTA'),
('TCS 509_ALT3', 'Machine Learning', 'MS. STUTI BHATT'),
('TCS 509_ALT4', 'Machine Learning', 'MS. RICHA GUPTA'),
('TCS 502', 'Operating Systems', 'DR. SEEMA GULATI'),
('TCS 502_ALT1', 'Operating Systems', 'DR. ASHISH GARG'),
('TCS 502_ALT2', 'Operating Systems', 'MR. TUSHAR SHARMA'),
('TCS 502_ALT3', 'Operating Systems', 'MS. MANIKA MANWAL'),
('TCS 503', 'Data Base Management Systems', 'MR. MUKESH KUMAR'),
('TCS 503_ALT1', 'Data Base Management Systems', 'DR. REHAN GAZI'),
('TCS 503_ALT2', 'Data Base Management Systems', 'DR. BINA BHANDARI'),
('TCS 503_ALT3', 'Data Base Management Systems', 'MR. MUKESH KUMAR'),
('TCS 514', 'Computer Networks I', 'MS. RICHA GUPTA'),
('TCS 514_ALT1', 'Computer Networks I', 'MR. PURUSHOTTAM DAS'),
('TCS 514_ALT2', 'Computer Networks I', 'MS. NEHA POKHRIYAL'),
=======
('TCS 502', 'Operating Systems', 'DR. SEEMA GULATI'),
('TCS 503', 'Data Base Management Systems', 'MR. MUKESH KUMAR'),
('TCS 514', 'Computer Networks I', 'MS. RICHA GUPTA'),
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
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
<<<<<<< HEAD
    section VARCHAR(10),
    day VARCHAR(10),
    time_start TIME,
    time_end TIME,
    subject_code VARCHAR(20),
    venue VARCHAR(50)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_timetable_section ON timetable(section);
CREATE INDEX IF NOT EXISTS idx_timetable_day ON timetable(day);
CREATE INDEX IF NOT EXISTS idx_timetable_venue ON timetable(venue);

-- Section: A1
INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A1','MON','08:00','08:55','PCS 503','UBUNTU LAB 2'),
('A1','MON','08:55','09:50','TCS 509','LT 302'),
('A1','MON','10:10','11:05','XCS 501','CR 206'),
('A1','MON','11:05','12:00','TCS 514','LT 302'),
('A1','MON','12:00','12:55','PCS 502','UBUNTU LAB 1'),
('A1','MON','12:55','13:50','ELECTIVE','CR 205'),
('A1','MON','14:10','15:05','TCS 584','LT 301'),
('A1','MON','15:05','16:00','TCS 571','LT 302'),
('A1','MON','16:00','16:55','TCS 595','CR 206');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A1','TUE','08:00','08:55','TCS 509','LT 202'),
('A1','TUE','08:55','09:50','CEC','LT 202'),
('A1','TUE','10:10','11:05','TCS 502','LT 202'),
('A1','TUE','11:05','12:00','TCS 503','LT 202'),
('A1','TUE','12:55','13:50','TCS 509','LT 201'),
('A1','TUE','14:10','15:05','ELECTIVE','CR 201'),
('A1','TUE','15:05','16:00','TCS 584','LT 302'),
('A1','TUE','16:00','16:55','TCS 571','CR 202');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A1','WED','10:10','11:05','TCS 502','LT 202'),
('A1','WED','11:05','12:00','PCS 502','LAB 1'),
('A1','WED','12:00','12:55','TCS 503','LT 302'),
('A1','WED','12:55','13:50','TCS 514','LT 302');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A1','THU','08:00','08:55','TCS 509','LT 302'),
('A1','THU','08:55','09:50','TCS 503','LT 302'),
('A1','THU','10:10','11:05','XCS 501','CR 104'),
('A1','THU','11:05','12:00','TCS 502','LT 202'),
('A1','THU','12:55','13:50','PCS 514','TCL 1'),
('A1','THU','14:10','15:05','ELECTIVE','LT 302'),
('A1','THU','15:05','16:00','TCS 593','LT 302');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A1','FRI','10:10','11:05','PROJECT BASED LEARNING','CR 204'),
('A1','FRI','11:05','12:00','TCS 514','LT 302'),
('A1','FRI','12:00','12:55','PESE 500','VENUE 2'),
('A1','FRI','14:10','15:05','ELECTIVE','LT 302');

-- Add Saturday periods for section A1
INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A1','SAT','09:00','10:30','ELECTIVE','LT 201'),
('A1','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('A1','SAT','14:00','15:30','TCS 552','LT 302');

-- Section: A2
INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A2','MON','08:00','08:55','PCS 502','TCL 4'),
('A2','MON','08:55','09:50','TCS 509','LT 302'),
('A2','MON','10:10','11:05','TCS 514','LT 302'),
('A2','MON','11:05','12:00','PCS 503','TCL 4'),
('A2','MON','12:55','13:50','ELECTIVE','CR 205'),
('A2','MON','14:10','15:05','TCS 584','LT 301'),
('A2','MON','15:05','16:00','TCS 571','LT 302');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A2','TUE','08:00','08:55','TCS 509','LT 202'),
('A2','TUE','08:55','09:50','CEC','LT 202'),
('A2','TUE','10:10','11:05','TCS 502','LT 202'),
('A2','TUE','11:05','12:00','TCS 503','LT 202'),
('A2','TUE','12:55','13:50','XCS 501','CR 104'),
('A2','TUE','14:10','15:05','ELECTIVE','LT 302');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A2','WED','11:05','12:00','PESE 500','VENUE 2'),
('A2','WED','12:55','13:50','TCS 503','LT 302'),
('A2','WED','14:10','15:05','TCS 514','LT 302');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A2','THU','08:00','08:55','TCS 509','LT 302'),
('A2','THU','08:55','09:50','TCS 503','LT 302'),
('A2','THU','10:10','11:05','TCS 502','LT 202'),
('A2','THU','12:55','13:50','PCS 502','LAB 9'),
('A2','THU','15:05','16:00','ELECTIVE','LT 302');

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A2','FRI','08:00','08:55','PCS 514','TCL 2'),
('A2','FRI','08:55','09:50','PCS 503','UBUNTU LAB 2'),
('A2','FRI','10:10','11:05','TCS 514','LT 302'),
('A2','FRI','14:10','15:05','PROJECT BASED LEARNING','CR 204');

-- Add Saturday periods for section A2
INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('A2','SAT','09:00','10:30','ELECTIVE','LT 201'),
('A2','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204');

-- Section: B1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B1','MON','08:00','08:55','PCS 503','UBUNTU LAB 2'),
('B1','MON','08:55','09:50','TCS 509','LT 302'),
('B1','MON','10:10','11:05','XCS 501','CR 206'),
('B1','MON','11:05','12:00','TCS 514','LT 302'),
('B1','MON','12:00','12:55','PCS 502','UBUNTU LAB 1'),
('B1','MON','12:55','13:50','ELECTIVE','CR 205'),
('B1','MON','14:10','15:05','TCS 584','LT 301'),
('B1','MON','15:05','16:00','TCS 571','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B1','TUE','08:00','08:55','TCS 509','LT 202'),
('B1','TUE','08:55','09:50','CEC','LT 202'),
('B1','TUE','10:10','11:05','TCS 502','LT 202'),
('B1','TUE','11:05','12:00','TCS 503','LT 202'),
('B1','TUE','12:55','13:50','TCS 509','LT 201'),
('B1','TUE','14:10','15:05','ELECTIVE','CR 201'),
('B1','TUE','15:05','16:00','TCS 584','LT 302'),
('B1','TUE','16:00','16:55','TCS 571','CR 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B1','WED','10:10','11:05','TCS 502','LT 202'),
('B1','WED','11:05','12:00','PCS 502','LAB 1'),
('B1','WED','12:00','12:55','TCS 503','LT 302'),
('B1','WED','12:55','13:50','TCS 514','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B1','THU','08:00','08:55','TCS 509','LT 302'),
('B1','THU','08:55','09:50','TCS 503','LT 302'),
('B1','THU','10:10','11:05','XCS 501','CR 104'),
('B1','THU','11:05','12:00','TCS 502','LT 202'),
('B1','THU','12:55','13:50','PCS 514','TCL 1'),
('B1','THU','14:10','15:05','ELECTIVE','LT 302'),
('B1','THU','15:05','16:00','TCS 593','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B1','FRI','10:10','11:05','PROJECT BASED LEARNING','CR 204'),
('B1','FRI','11:05','12:00','TCS 514','LT 302'),
('B1','FRI','12:00','12:55','PESE 500','VENUE 2'),
('B1','FRI','14:10','15:05','ELECTIVE','LT 302');


-- Add Saturday periods for section B1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B1','SAT','09:00','10:30','ELECTIVE','LT 201'),
('B1','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('B1','SAT','14:00','15:30','TCS 552','LT 302');


-- Section: B2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B2','MON','08:00','08:55','PCS 502','TCL 4'),
('B2','MON','08:55','09:50','TCS 509','LT 302'),
('B2','MON','10:10','11:05','TCS 514','LT 302'),
('B2','MON','11:05','12:00','PCS 503','TCL 4'),
('B2','MON','12:55','13:50','ELECTIVE','CR 205'),
('B2','MON','14:10','15:05','TCS 584','LT 301'),
('B2','MON','15:05','16:00','TCS 571','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B2','TUE','08:00','08:55','TCS 509','LT 202'),
('B2','TUE','08:55','09:50','CEC','LT 202'),
('B2','TUE','10:10','11:05','TCS 502','LT 202'),
('B2','TUE','11:05','12:00','TCS 503','LT 202'),
('B2','TUE','12:55','13:50','XCS 501','CR 104'),
('B2','TUE','14:10','15:05','ELECTIVE','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B2','WED','11:05','12:00','PESE 500','VENUE 2'),
('B2','WED','12:55','13:50','TCS 503','LT 302'),
('B2','WED','14:10','15:05','TCS 514','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B2','THU','08:00','08:55','TCS 509','LT 302'),
('B2','THU','08:55','09:50','TCS 503','LT 302'),
('B2','THU','10:10','11:05','TCS 502','LT 202'),
('B2','THU','12:55','13:50','PCS 502','LAB 9'),
('B2','THU','15:05','16:00','ELECTIVE','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B2','FRI','08:00','08:55','PCS 514','TCL 2'),
('B2','FRI','08:55','09:50','PCS 503','UBUNTU LAB 2'),
('B2','FRI','10:10','11:05','TCS 514','LT 302'),
('B2','FRI','14:10','15:05','PROJECT BASED LEARNING','CR 204');


-- Add Saturday periods for section B2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('B2','SAT','09:00','10:30','ELECTIVE','LT 201'),
('B2','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204');


-- Section: C1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C1','MON','08:00','08:55','PCS 502','UBUNTU LAB 1'),
('C1','MON','08:55','09:50','TCS 503','LT 201'),
('C1','MON','10:10','11:05','TCS 514','LT 301'),
('C1','MON','11:05','12:00','PCS 514','TCL 3'),
('C1','MON','12:55','13:50','ELECTIVE','CR 205');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C1','TUE','08:00','08:55','PROJECT BASED LEARNING','(varies)'),
('C1','TUE','08:55','09:50','CEC','LT 202'),
('C1','TUE','10:10','11:05','TCS 502','LT 202'),
('C1','TUE','11:05','12:00','TCS 509','CR 205'),
('C1','TUE','12:55','13:50','TCS 503','LT 201'),
('C1','TUE','14:10','15:05','TCS 514','LT 301');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C1','WED','08:00','08:55','PCS 503','LAB 9'),
('C1','WED','10:10','11:05','PESE 500','VENUE 1'),
('C1','WED','11:05','12:00','TCS 502','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C1','THU','08:00','08:55','PCS 502','LAB 1'),
('C1','THU','08:55','09:50','TCS 503','LT 301'),
('C1','THU','10:10','11:05','TCS 502','LT 202'),
('C1','THU','11:05','12:00','XCS 501','CR 203'),
('C1','THU','12:55','13:50','TCS 509','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C1','FRI','08:00','08:55','PCS 503','UBUNTU LAB 1'),
('C1','FRI','10:10','11:05','TCS 514','LT 302'),
('C1','FRI','12:55','13:50','ELECTIVE','(varies)');


-- Section: C2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C2','MON','08:00','08:55','PCS 514','TCL 2'),
('C2','MON','08:55','09:50','PCS 503','TCL 2'),
('C2','MON','10:10','11:05','TCS 503','LT 201'),
('C2','MON','11:05','12:00','TCS 502','LT 202'),
('C2','MON','12:55','13:50','PROJECT BASED LEARNING','(varies)'),
('C2','MON','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C2','TUE','08:00','08:55','TCS 514','LT 301'),
('C2','TUE','08:55','09:50','PCS 502','TCL 1'),
('C2','TUE','10:10','11:05','PCS 503','LAB 9'),
('C2','TUE','11:05','12:00','TCS 509','LT 201');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C2','WED','08:00','08:55','TCS 503','LT 201'),
('C2','WED','10:10','11:05','TCS 514','LT 302'),
('C2','WED','11:05','12:00','TCS 502','LT 302'),
('C2','WED','12:55','13:50','PCS 514','TCL 3');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C2','THU','08:00','08:55','TCS 514','LT 301'),
('C2','THU','08:55','09:50','TCS 509','LT 201'),
('C2','THU','10:10','11:05','CEC','LT 202'),
('C2','THU','11:05','12:00','PESE 500','VENUE 1');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('C2','FRI','08:00','08:55','PCS 502','LAB 9'),
('C2','FRI','10:10','11:05','TCS 503','LT 201'),
('C2','FRI','12:55','13:50','ELECTIVE','(varies)');


-- Section: D1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D1','MON','08:00','08:55','PCS 502','UBUNTU LAB 1'),
('D1','MON','08:55','09:50','TCS 502','CR 205'),
('D1','MON','10:10','11:05','PCS 503','LAB 9'),
('D1','MON','11:05','12:00','XCS 501','LT 302'),
('D1','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D1','TUE','08:00','08:55','PROJECT BASED LEARNING','(varies)'),
('D1','TUE','08:55','09:50','TCS 503','LT 301'),
('D1','TUE','10:10','11:05','TCS 509','LT 302'),
('D1','TUE','11:05','12:00','TCS 502','CR 204'),
('D1','TUE','12:55','13:50','PCS 503','TCL 2');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D1','WED','08:00','08:55','PCS 514','TCL 1'),
('D1','WED','10:10','11:05','PESE 500','VENUE 1'),
('D1','WED','11:05','12:00','TCS 502','LT 202'),
('D1','WED','12:55','13:50','TCS 514','LT 201');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D1','THU','08:00','08:55','PCS 502','LAB 9'),
('D1','THU','08:55','09:50','TCS 503','LT 301'),
('D1','THU','10:10','11:05','TCS 502','LT 202'),
('D1','THU','11:05','12:00','PCS 503','LAB 3'),
('D1','THU','12:55','13:50','TCS 509','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D1','FRI','08:00','08:55','PCS 503','LAB 9'),
('D1','FRI','10:10','11:05','PROJECT BASED LEARNING','(varies)'),
('D1','FRI','12:00','12:55','TCS 514','LT 301'),
('D1','FRI','14:10','15:05','ELECTIVE','(varies)');

-- Add Saturday periods for section D1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D1','SAT','09:00','10:30','ELECTIVE','LT 201'),
('D1','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('D1','SAT','14:00','15:30','TCS 552','LT 302');

-- Section: D2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D2','MON','08:00','08:55','PCS 502','UBUNTU LAB 1'),
('D2','MON','08:55','09:50','TCS 502','CR 204'),
('D2','MON','10:10','11:05','PCS 503','LAB 9'),
('D2','MON','11:05','12:00','XCS 501','LT 302'),
('D2','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D2','TUE','08:00','08:55','PROJECT BASED LEARNING','(varies)'),
('D2','TUE','08:55','09:50','TCS 503','LT 301'),
('D2','TUE','10:10','11:05','TCS 509','LT 302'),
('D2','TUE','11:05','12:00','TCS 502','CR 204'),
('D2','TUE','12:55','13:50','PCS 503','TCL 2');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D2','WED','08:00','08:55','PCS 514','TCL 1'),
('D2','WED','10:10','11:05','PESE 500','VENUE 1'),
('D2','WED','11:05','12:00','TCS 502','LT 202'),
('D2','WED','12:55','13:50','TCS 514','LT 201');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D2','THU','08:00','08:55','PCS 502','LAB 9'),
('D2','THU','08:55','09:50','TCS 503','LT 301'),
('D2','THU','10:10','11:05','TCS 502','LT 202'),
('D2','THU','11:05','12:00','PCS 503','LAB 3'),
('D2','THU','12:55','13:50','TCS 509','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('D2','FRI','08:00','08:55','PCS 503','LAB 9'),
('D2','FRI','10:10','11:05','PROJECT BASED LEARNING','(varies)'),
('D2','FRI','12:00','12:55','TCS 514','LT 301'),
('D2','FRI','14:10','15:05','ELECTIVE','(varies)');


-- Section: E1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E1','MON','08:00','08:55','PESE 500','VENUE 2'),
('E1','MON','08:55','09:50','TCS 502','CR 205'),
('E1','MON','10:10','11:05','PCS 503','LAB 9'),
('E1','MON','11:05','12:00','XCS 501','LT 302'),
('E1','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E1','TUE','08:00','08:55','PCS 502','TCL 4'),
('E1','TUE','08:55','09:50','TCS 514','CR 203'),
('E1','TUE','10:10','11:05','TCS 503','LT 202'),
('E1','TUE','11:05','12:00','TCS 502','LT 301'),
('E1','TUE','12:55','13:50','TCS 509','LT 302'),
('E1','TUE','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E1','WED','08:00','08:55','CEC','LT 201'),
('E1','WED','10:10','11:05','TCS 514','CR 201'),
('E1','WED','11:05','12:00','PCS 514','TCL 3'),
('E1','WED','12:55','13:50','TCS 509','CR 205');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E1','THU','10:10','11:05','TCS 503','LT 302'),
('E1','THU','11:05','12:00','TCS 502','CR 201'),
('E1','THU','12:55','13:50','TCS 514','CR 202'),
('E1','THU','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E1','FRI','08:00','08:55','PCS 514','TCL 1'),
('E1','FRI','10:10','11:05','TCS 502','CR 104'),
('E1','FRI','11:05','12:00','TCS 503','LT 302'),
('E1','FRI','14:10','15:05','PROJECT BASED LEARNING','PCS 502');


-- Section: E2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E2','MON','08:00','08:55','PCS 514','TCL 2'),
('E2','MON','08:55','09:50','PCS 503','TCL 2'),
('E2','MON','10:10','11:05','TCS 503','LT 201'),
('E2','MON','11:05','12:00','TCS 502','LT 202'),
('E2','MON','12:55','13:50','PROJECT BASED LEARNING','(varies)'),
('E2','MON','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E2','TUE','08:00','08:55','TCS 514','LT 301'),
('E2','TUE','08:55','09:50','PCS 502','TCL 1'),
('E2','TUE','10:10','11:05','PCS 503','LAB 9'),
('E2','TUE','11:05','12:00','TCS 509','LT 201');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E2','WED','08:00','08:55','TCS 503','LT 201'),
('E2','WED','10:10','11:05','TCS 514','LT 302'),
('E2','WED','11:05','12:00','TCS 502','LT 302'),
('E2','WED','12:55','13:50','PCS 514','TCL 3');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E2','THU','08:00','08:55','TCS 514','LT 301'),
('E2','THU','08:55','09:50','TCS 509','LT 201'),
('E2','THU','10:10','11:05','CEC','LT 202'),
('E2','THU','11:05','12:00','PESE 500','VENUE 1');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('E2','FRI','08:00','08:55','PCS 502','LAB 9'),
('E2','FRI','10:10','11:05','TCS 503','LT 201'),
('E2','FRI','12:55','13:50','ELECTIVE','(varies)');


-- Section: F1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F1','MON','08:00','08:55','PCS 502','UBUNTU LAB 1'),
('F1','MON','08:55','09:50','TCS 503','LT 201'),
('F1','MON','10:10','11:05','TCS 514','LT 301'),
('F1','MON','11:05','12:00','PCS 514','TCL 3'),
('F1','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F1','TUE','08:00','08:55','PROJECT BASED LEARNING','(varies)'),
('F1','TUE','08:55','09:50','CEC','LT 202'),
('F1','TUE','10:10','11:05','TCS 502','LT 202'),
('F1','TUE','11:05','12:00','TCS 509','CR 205'),
('F1','TUE','12:55','13:50','TCS 503','LT 201'),
('F1','TUE','14:10','15:05','TCS 514','LT 301');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F1','WED','08:00','08:55','PCS 503','LAB 9'),
('F1','WED','10:10','11:05','PESE 500','VENUE 1'),
('F1','WED','11:05','12:00','TCS 502','LT 201');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F1','THU','08:00','08:55','PCS 514','TCL 2'),
('F1','THU','10:10','11:05','TCS 514','CR 202'),
('F1','THU','11:05','12:00','TCS 509','CR 204'),
('F1','THU','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F1','FRI','08:00','08:55','CEC','LT 201'),
('F1','FRI','10:10','11:05','TCS 502','CR 204'),
('F1','FRI','11:05','12:00','TCS 503','LT 301'),
('F1','FRI','14:10','15:05','ELECTIVE','(varies)');


-- Section: F2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F2','MON','08:00','08:55','PCS 502','LAB 1'),
('F2','MON','08:55','09:50','TCS 509','CR 204'),
('F2','MON','10:10','11:05','TCS 514','CR 202'),
('F2','MON','11:05','12:00','TCS 503','LT 201'),
('F2','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F2','TUE','08:00','08:55','TCS 502','CR 204'),
('F2','TUE','08:55','09:50','PROJECT BASED LEARNING','PCS 514'),
('F2','TUE','10:10','11:05','PCS 502','LAB 1'),
('F2','TUE','11:05','12:00','TCS 503','LT 301'),
('F2','TUE','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F2','WED','08:00','08:55','PESE 500','VENUE 2'),
('F2','WED','10:10','11:05','TCS 502','LT 201'),
('F2','WED','11:05','12:00','TCS 509','CR 206'),
('F2','WED','12:55','13:50','PCS 503','UBUNTU LAB 1');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F2','THU','08:00','08:55','PCS 503','TCL 1'),
('F2','THU','08:55','09:50','TCS 509','CR 204'),
('F2','THU','10:10','11:05','TCS 514','CR 202'),
('F2','THU','11:05','12:00','TCS 503','LT 301');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F2','FRI','08:00','08:55','XCS 501','CR 203'),
('F2','FRI','10:10','11:05','TCS 511','LT 202'),
('F2','FRI','11:05','12:00','TCS 503','LT 301'),
('F2','FRI','14:10','15:05','ELECTIVE','(varies)');

-- Add Saturday periods for section F2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('F2','SAT','09:00','10:30','ELECTIVE','LT 201'),
('F2','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('F2','SAT','14:00','15:30','TCS 552','LT 302');


-- Section: G1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G1','MON','08:00','08:55','PCS 502','UBUNTU LAB 1'),
('G1','MON','08:55','09:50','TCS 509','LT 302'),
('G1','MON','10:10','11:05','TCS 514','LT 302'),
('G1','MON','11:05','12:00','PCS 503','TCL 3'),
('G1','MON','12:55','13:50','ELECTIVE','(varies)'),
('G1','MON','14:10','15:05','TCS 584','LT 301');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G1','TUE','08:00','08:55','PROJECT BASED LEARNING','(varies)'),
('G1','TUE','08:55','09:50','CEC','LT 202'),
('G1','TUE','10:10','11:05','TCS 502','LT 202'),
('G1','TUE','11:05','12:00','TCS 509','CR 205'),
('G1','TUE','12:55','13:50','TCS 503','LT 201'),
('G1','TUE','14:10','15:05','TCS 514','LT 301');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G1','WED','08:00','08:55','PCS 503','LAB 9'),
('G1','WED','10:10','11:05','PESE 500','VENUE 1'),
('G1','WED','11:05','12:00','TCS 502','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G1','THU','08:00','08:55','PCS 502','LAB 1'),
('G1','THU','08:55','09:50','TCS 503','LT 301'),
('G1','THU','10:10','11:05','TCS 502','LT 202'),
('G1','THU','11:05','12:00','XCS 501','CR 203'),
('G1','THU','12:55','13:50','TCS 509','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G1','FRI','08:00','08:55','PCS 503','UBUNTU LAB 1'),
('G1','FRI','10:10','11:05','TCS 514','LT 302'),
('G1','FRI','12:55','13:50','ELECTIVE','(varies)');

-- Add Saturday periods for section G1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G1','SAT','09:00','10:30','ELECTIVE','LT 201'),
('G1','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('G1','SAT','14:00','15:30','TCS 552','LT 302');


-- Section: G2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G2','MON','08:00','08:55','PCS 502','TCL 4'),
('G2','MON','08:55','09:50','TCS 509','LT 302'),
('G2','MON','10:10','11:05','TCS 514','LT 302'),
('G2','MON','11:05','12:00','PCS 503','TCL 4'),
('G2','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G2','TUE','08:00','08:55','TCS 509','LT 202'),
('G2','TUE','08:55','09:50','CEC','LT 202'),
('G2','TUE','10:10','11:05','TCS 502','LT 202'),
('G2','TUE','11:05','12:00','TCS 503','LT 202'),
('G2','TUE','12:55','13:50','XCS 501','CR 104'),
('G2','TUE','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G2','WED','11:05','12:00','PESE 500','VENUE 2'),
('G2','WED','12:55','13:50','TCS 503','LT 302'),
('G2','WED','14:10','15:05','TCS 514','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G2','THU','08:00','08:55','TCS 509','LT 302'),
('G2','THU','08:55','09:50','TCS 503','LT 302'),
('G2','THU','10:10','11:05','TCS 502','LT 202'),
('G2','THU','12:55','13:50','PCS 502','LAB 9'),
('G2','THU','15:05','16:00','ELECTIVE','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G2','FRI','08:00','08:55','PCS 514','TCL 2'),
('G2','FRI','08:55','09:50','PCS 503','UBUNTU LAB 2'),
('G2','FRI','10:10','11:05','TCS 514','LT 302'),
('G2','FRI','14:10','15:05','PROJECT BASED LEARNING','CR 204');

-- Add Saturday periods for section G2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('G2','SAT','09:00','10:30','ELECTIVE','LT 201'),
('G2','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('G2','SAT','14:00','15:30','TCS 552','LT 302');


-- Section: H1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H1','MON','08:00','08:55','PCS 502','UBUNTU LAB 1'),
('H1','MON','08:55','09:50','TCS 503','LT 201'),
('H1','MON','10:10','11:05','TCS 514','LT 301'),
('H1','MON','11:05','12:00','PCS 514','TCL 3'),
('H1','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H1','TUE','08:00','08:55','PROJECT BASED LEARNING','(varies)'),
('H1','TUE','08:55','09:50','CEC','LT 202'),
('H1','TUE','10:10','11:05','TCS 502','LT 202'),
('H1','TUE','11:05','12:00','TCS 509','CR 205'),
('H1','TUE','12:55','13:50','TCS 503','LT 201'),
('H1','TUE','14:10','15:05','TCS 514','LT 301');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H1','WED','08:00','08:55','PCS 503','LAB 9'),
('H1','WED','10:10','11:05','PESE 500','VENUE 1'),
('H1','WED','11:05','12:00','TCS 502','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H1','THU','08:00','08:55','PCS 502','LAB 1'),
('H1','THU','08:55','09:50','TCS 503','LT 301'),
('H1','THU','10:10','11:05','TCS 502','LT 202'),
('H1','THU','11:05','12:00','XCS 501','CR 203'),
('H1','THU','12:55','13:50','TCS 509','LT 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H1','FRI','08:00','08:55','PCS 503','UBUNTU LAB 1'),
('H1','FRI','10:10','11:05','TCS 514','LT 302'),
('H1','FRI','12:55','13:50','ELECTIVE','(varies)');

-- Add Saturday periods for section H1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H1','SAT','09:00','10:30','ELECTIVE','LT 201'),
('H1','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('H1','SAT','14:00','15:30','TCS 552','LT 302');


-- Section: H2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H2','MON','08:00','08:55','PCS 502','TCL 4'),
('H2','MON','08:55','09:50','TCS 509','LT 302'),
('H2','MON','10:10','11:05','TCS 514','LT 302'),
('H2','MON','11:05','12:00','PCS 503','TCL 4'),
('H2','MON','12:55','13:50','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H2','TUE','08:00','08:55','TCS 509','LT 202'),
('H2','TUE','08:55','09:50','CEC','LT 202'),
('H2','TUE','10:10','11:05','TCS 502','LT 202'),
('H2','TUE','11:05','12:00','TCS 503','LT 202'),
('H2','TUE','12:55','13:50','XCS 501','CR 104'),
('H2','TUE','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H2','WED','11:05','12:00','PESE 500','VENUE 2'),
('H2','WED','12:55','13:50','TCS 503','LT 302'),
('H2','WED','14:10','15:05','TCS 514','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H2','THU','08:00','08:55','TCS 509','LT 302'),
('H2','THU','08:55','09:50','TCS 503','LT 302'),
('H2','THU','10:10','11:05','TCS 502','LT 202'),
('H2','THU','12:55','13:50','PCS 502','LAB 9'),
('H2','THU','15:05','16:00','ELECTIVE','LT 302');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H2','FRI','08:00','08:55','PCS 514','TCL 2'),
('H2','FRI','08:55','09:50','PCS 503','UBUNTU LAB 2'),
('H2','FRI','10:10','11:05','TCS 514','LT 302'),
('H2','FRI','14:10','15:05','PROJECT BASED LEARNING','CR 204');

-- Add Saturday periods for section H2

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('H2','SAT','09:00','10:30','ELECTIVE','LT 201'),
('H2','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('H2','SAT','14:00','15:30','TCS 552','LT 302');


-- Section: I1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('I1','MON','08:00','08:55','CEC','LT 201'),
('I1','MON','08:55','09:50','TCS 509','CR 203'),
('I1','MON','10:10','11:05','PCS 503','TCL 3'),
('I1','MON','11:05','12:00','TCS 503','LT 301'),
('I1','MON','12:55','13:50','TCS 514','CR 201'),
('I1','MON','14:10','15:05','ELECTIVE','(varies)');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('I1','TUE','08:00','08:55','TCS 502','CR 104'),
('I1','TUE','10:10','11:05','TCS 514','CR 204'),
('I1','TUE','11:05','12:00','TCS 509','CR 202'),
('I1','TUE','12:55','13:50','PCS 503','TCL 2'),
('I1','TUE','14:10','15:05','XCS 501','CR 206');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('I1','WED','10:10','11:05','XCS 501','CR 204'),
('I1','WED','11:05','12:00','PCS 502','UBUNTU LAB 2'),
('I1','WED','12:55','13:50','PESE 500','VENUE 2');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('I1','THU','10:10','11:05','TCS 509','CR 203'),
('I1','THU','11:05','12:00','TCS 503','LT 302'),
('I1','THU','12:55','13:50','TCS 502','CR 201'),
('I1','THU','14:10','15:05','TCS 514','CR 202');


INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('I1','FRI','08:00','08:55','PCS 514','TCL 1'),
('I1','FRI','10:10','11:05','TCS 502','CR 104'),
('I1','FRI','11:05','12:00','TCS 503','LT 302'),
('I1','FRI','14:10','15:05','PROJECT BASED LEARNING','PCS 502');

-- Add Saturday periods for section I1

INSERT OR REPLACE INTO timetable (section, day, time_start, time_end, subject_code, venue) VALUES
('I1','SAT','09:00','10:30','ELECTIVE','LT 201'),
('I1','SAT','11:00','12:30','PROJECT BASED LEARNING','CR 204'),
('I1','SAT','14:00','15:30','TCS 552','LT 302');

=======
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
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
