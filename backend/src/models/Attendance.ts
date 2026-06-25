export interface Attendance {
  id?: string;
  student_id: string;
  subject_id: string;
  date: string;
  status: 'Present' | 'Absent';
  created_at?: string;
}

export interface AttendanceRecordInput {
  studentId: string;
  status: 'Present' | 'Absent';
}
