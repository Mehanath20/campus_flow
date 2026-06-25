import { supabase } from '../config/supabase';

export const recalculateStudentAttendance = async (studentId: string): Promise<number> => {
  // 1. Fetch all records for this student
  const { data: studentRecords, error } = await supabase
    .from('attendance')
    .select('status')
    .eq('student_id', studentId);

  if (error || !studentRecords || studentRecords.length === 0) {
    return 0;
  }

  const totalClasses = studentRecords.length;
  const presentClasses = studentRecords.filter((r) => r.status === 'Present').length;
  
  const attendancePercentage = Number(((presentClasses / totalClasses) * 100).toFixed(2));

  // 2. Update student overall percentage
  await supabase
    .from('students')
    .update({ overall_attendance_percentage: attendancePercentage })
    .eq('id', studentId);

  return attendancePercentage;
};
