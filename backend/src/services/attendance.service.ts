import fs from 'fs';
import path from 'path';
import { AttendanceRecordInput } from '../models/Attendance';
import { recalculateStudentAttendance } from './attendancePercentage.service';
import { triggerN8nAttendanceWebhook } from './n8n.service';

const subjectsFilePath = path.join(__dirname, '../data/subjects.json');
const attendanceFilePath = path.join(__dirname, '../data/attendance.json');
const studentsFilePath = path.join(__dirname, '../data/students.json');

export const markAttendance = async (
  subjectId: string,
  date: string,
  attendance: AttendanceRecordInput[]
) => {
  // 1. Validate subject exists and get details
  const subjectsData = fs.readFileSync(subjectsFilePath, 'utf8');
  const allSubjects = JSON.parse(subjectsData);
  const subject = allSubjects.find((s: any) => s.id === subjectId);

  if (!subject) {
    throw new Error('Invalid subject ID');
  }

  // 2. Store attendance records
  const recordsToInsert = attendance.map((record) => ({
    id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    student_id: record.studentId,
    subject_id: subjectId,
    date,
    status: record.status,
    created_at: new Date().toISOString()
  }));

  const attendanceData = fs.readFileSync(attendanceFilePath, 'utf8');
  const allAttendance = JSON.parse(attendanceData);
  
  allAttendance.push(...recordsToInsert);
  fs.writeFileSync(attendanceFilePath, JSON.stringify(allAttendance, null, 2));

  // 3. For every student, calculate attendance percentage and get student details
  const studentsPayload = [];

  const studentsData = fs.readFileSync(studentsFilePath, 'utf8');
  const allStudents = JSON.parse(studentsData);

  for (const record of attendance) {
    // Recalculate percentage
    const updatedPercentage = await recalculateStudentAttendance(record.studentId);
    
    // Get student details for the payload
    const student = allStudents.find((s: any) => s.id === record.studentId);

    if (student) {
      // Calculate required classes to hit 75% if below
      let requiredClasses = 0;
      if (updatedPercentage < 75) {
        // Simple mock calculation: for every missing %, roughly 1 class needed (customizable logic)
        requiredClasses = Math.ceil((75 - updatedPercentage) / 2); 
      }

      studentsPayload.push({
        studentId: record.studentId,
        name: student.name,
        telegramChatId: student.telegram_chat_id || "123456789",
        attendanceStatus: record.status,
        attendancePercentage: updatedPercentage,
        requiredClasses: requiredClasses
      });
    }
  }

  // 4. Trigger n8n webhook with all students
  if (studentsPayload.length > 0) {
    const payload = {
      subject: subject.subject_name,
      faculty: subject.faculty_id,
      date: date,
      students: studentsPayload
    };

    await triggerN8nAttendanceWebhook(payload);
  }

  return { success: true, message: 'Attendance marked successfully' };
};
