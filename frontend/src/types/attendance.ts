export interface Student {
  id: string;
  register_number: string;
  name: string;
  email?: string;
  password?: string;
  overall_attendance_percentage: number;
}

export interface Subject {
  id: string;
  subject_name: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | null;

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
}

export interface AttendanceFiltersState {
  subjectId: string;
  date: string;
}

export interface MarkAttendancePayload {
  subjectId: string;
  date: string;
  attendance: {
    studentId: string;
    status: 'Present' | 'Absent';
  }[];
}
