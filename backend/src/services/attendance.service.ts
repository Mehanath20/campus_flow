import { supabase } from '../config/supabase';
import { AttendanceRecordInput } from '../models/Attendance';
import { triggerN8nAttendanceWebhook } from './n8n.service';
import { recalculateStudentAttendance } from './attendancePercentage.service';

export const markAttendance = async (
  subjectId: string,
  date: string,
  attendance: AttendanceRecordInput[]
) => {
  // 1. Validate subject
  const { data: subject, error: subjectError } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single();

  if (subjectError || !subject) {
    throw new Error('Invalid subject ID');
  }

  // 2. Insert Attendance
  const recordsToInsert = attendance.map((record) => ({
    id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    student_id: record.studentId,
    subject_id: subjectId,
    date,
    status: record.status,
    created_at: new Date().toISOString()
  }));

  const { error: insertError } = await supabase.from('attendance').insert(recordsToInsert);
  if (insertError) throw new Error('Failed to insert attendance');

  // 3. For every student, calculate percentage
  const studentsPayload = [];
  
  for (const record of attendance) {
    const updatedPercentage = await recalculateStudentAttendance(record.studentId);
    
    // Get student details
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('id', record.studentId)
      .single();

    if (student) {
      let requiredClasses = 0;
      if (updatedPercentage < 75) {
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

  // 4. Trigger n8n webhook
  if (studentsPayload.length > 0) {
    const payload = {
      subject: subject.subject_name,
      faculty: subject.faculty_id,
      date: date,
      students: studentsPayload
    };

    await triggerN8nAttendanceWebhook(payload);
  }

  return { success: true, message: 'Attendance marked successfully via Supabase' };
};
