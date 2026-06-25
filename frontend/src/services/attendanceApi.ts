import { MarkAttendancePayload, Student, Subject } from '../types/attendance';

// Force relative path so Next.js rewrites handle all network/CORS issues
const API_URL = '/api';

export const getSubjects = async (): Promise<Subject[]> => {
  const url = `${API_URL}/attendance/subjects`;
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to fetch subjects. URL: ${url}, Status: ${response.status} ${response.statusText}. Body: ${text}`);
  }
  const data = await response.json();
  return data.subjects;
};

export const getStudentsForAttendance = async (): Promise<Student[]> => {
  const response = await fetch(`${API_URL}/attendance/students`);
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  const data = await response.json();
  return data.students;
};

export const getStudentAttendanceByEmail = async (email: string) => {
  const queryParams = new URLSearchParams({ email: email.trim() });
  const response = await fetch(`${API_URL}/attendance/student-records?${queryParams}`);
  if (!response.ok) {
    const errorData = await response.text().catch(() => '');
    throw new Error(`Failed to fetch student attendance: ${response.status} ${errorData}`);
  }
  return response.json();
};

export const markAttendance = async (payload: MarkAttendancePayload): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/attendance/mark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit attendance');
  }

  return response.json();
};
