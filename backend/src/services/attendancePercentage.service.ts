import fs from 'fs';
import path from 'path';

const attendanceFilePath = path.join(__dirname, '../data/attendance.json');
const studentsFilePath = path.join(__dirname, '../data/students.json');

export const recalculateStudentAttendance = async (studentId: string): Promise<number> => {
  const attendanceData = fs.readFileSync(attendanceFilePath, 'utf8');
  const allAttendance = JSON.parse(attendanceData);
  
  const studentRecords = allAttendance.filter((r: any) => r.student_id === studentId);

  if (!studentRecords || studentRecords.length === 0) {
    return 0;
  }

  const totalClasses = studentRecords.length;
  const presentClasses = studentRecords.filter((record: any) => record.status === 'Present').length;
  
  const attendancePercentage = Number(((presentClasses / totalClasses) * 100).toFixed(2));

  // Update student overall attendance percentage
  const studentsData = fs.readFileSync(studentsFilePath, 'utf8');
  const allStudents = JSON.parse(studentsData);
  
  const studentIndex = allStudents.findIndex((s: any) => s.id === studentId);
  if (studentIndex !== -1) {
    allStudents[studentIndex].overall_attendance_percentage = attendancePercentage;
    fs.writeFileSync(studentsFilePath, JSON.stringify(allStudents, null, 2));
  }

  return attendancePercentage;
};
