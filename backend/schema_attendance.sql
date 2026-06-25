CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    register_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telegram_chat_id TEXT,
    branch TEXT,
    year TEXT,
    section TEXT,
    overall_attendance_percentage NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    subject_name TEXT NOT NULL,
    faculty_id TEXT
);

CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
