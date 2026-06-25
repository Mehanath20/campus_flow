import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: SUPABASE_URL or SUPABASE_SERVICE_KEY is missing in your .env file!");
  console.error("Please add them before running this migration.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("🚀 Starting migration from JSON to Supabase...");

  try {
    // 1. Migrate Subjects
    console.log("Migrating subjects...");
    const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/subjects.json'), 'utf8'));
    for (const subject of subjects) {
      const { error } = await supabase.from('subjects').upsert({
        id: subject.id,
        subject_name: subject.subject_name,
        faculty_id: subject.faculty_id
      });
      if (error) throw error;
    }
    console.log(`✅ Successfully migrated ${subjects.length} subjects!`);

    // 2. Migrate Students
    console.log("Migrating students...");
    const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/students.json'), 'utf8'));
    for (const student of students) {
      const { error } = await supabase.from('students').upsert({
        id: student.id,
        register_number: student.register_number,
        name: student.name,
        email: student.email,
        telegram_chat_id: student.telegram_chat_id,
        branch: student.branch,
        year: student.year,
        section: student.section,
        overall_attendance_percentage: student.overall_attendance_percentage
      });
      if (error) throw error;
    }
    console.log(`✅ Successfully migrated ${students.length} students!`);

    // 3. Migrate Attendance
    console.log("Migrating attendance records...");
    if (fs.existsSync(path.join(__dirname, 'src/data/attendance.json'))) {
      const attendance = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/attendance.json'), 'utf8'));
      for (const record of attendance) {
        const { error } = await supabase.from('attendance').upsert({
          id: record.id,
          student_id: record.student_id,
          subject_id: record.subject_id,
          date: record.date,
          status: record.status,
          created_at: record.created_at
        });
        if (error) throw error;
      }
      console.log(`✅ Successfully migrated ${attendance.length} attendance records!`);
    } else {
      console.log("ℹ️ No attendance records found to migrate.");
    }

    console.log("🎉 MIGRATION COMPLETE! You are ready for production.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrate();
