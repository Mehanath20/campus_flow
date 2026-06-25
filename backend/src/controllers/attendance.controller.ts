import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { markAttendance } from '../services/attendance.service';

export const submitAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId, date, attendance } = req.body;
    if (!subjectId || !date || !attendance || !Array.isArray(attendance)) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const result = await markAttendance(subjectId, date, attendance);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getStudentAttendanceByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Email query parameter is required' });
      return;
    }

    const studentEmail = email.trim().toLowerCase();
    
    // Fetch student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .ilike('email', studentEmail)
      .single();

    if (studentError || !student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    // Fetch records
    const { data: records, error: recordsError } = await supabase
      .from('attendance')
      .select('*, subjects(subject_name)')
      .eq('student_id', student.id);

    const studentRecords = (records || []).map((r: any) => ({
      ...r,
      subject_name: r.subjects?.subject_name || 'Unknown Subject'
    }));

    res.status(200).json({
      student: {
        id: student.id,
        name: student.name,
        overall_attendance_percentage: student.overall_attendance_percentage
      },
      records: studentRecords
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getStudentsForAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('id, register_number, name, email, overall_attendance_percentage')
      .order('register_number');
      
    if (error) throw error;
    res.status(200).json({ students });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: subjects, error } = await supabase.from('subjects').select('*');
    if (error) throw error;
    res.status(200).json({ subjects });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
