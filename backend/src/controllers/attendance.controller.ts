import { Request, Response } from 'express';
import { markAttendance } from '../services/attendance.service';
import fs from 'fs';
import path from 'path';

const studentsFilePath = path.join(__dirname, '../data/students.json');
const subjectsFilePath = path.join(__dirname, '../data/subjects.json');

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
    console.error('Error submitting attendance:', error);
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

    const studentsData = fs.readFileSync(studentsFilePath, 'utf8');
    const allStudents = JSON.parse(studentsData);
    const studentEmail = (email as string).trim().toLowerCase();
    const student = allStudents.find((s: any) => s.email.trim().toLowerCase() === studentEmail);

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    // Read attendance records
    const attendanceFilePath = path.join(__dirname, '../data/attendance.json');
    let allAttendance = [];
    if (fs.existsSync(attendanceFilePath)) {
      allAttendance = JSON.parse(fs.readFileSync(attendanceFilePath, 'utf8'));
    }

    // Read subjects to map subject name
    const subjectsData = fs.readFileSync(subjectsFilePath, 'utf8');
    const subjects = JSON.parse(subjectsData);
    const subjectMap = new Map(subjects.map((sub: any) => [sub.id, sub.subject_name]));

    const studentRecords = allAttendance
      .filter((record: any) => record.student_id === student.id)
      .map((record: any) => ({
        ...record,
        subject_name: subjectMap.get(record.subject_id) || 'Unknown Subject'
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
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getStudentsForAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentsData = fs.readFileSync(studentsFilePath, 'utf8');
    const allStudents = JSON.parse(studentsData);
    
    const students = allStudents
      .map((s: any) => ({
        id: s.id,
        register_number: s.register_number,
        name: s.name,
        email: s.email,
        password: s.password,
        overall_attendance_percentage: s.overall_attendance_percentage
      }))
      .sort((a: any, b: any) => a.register_number.localeCompare(b.register_number));

    res.status(200).json({ students });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjectsData = fs.readFileSync(subjectsFilePath, 'utf8');
    const subjects = JSON.parse(subjectsData);
    res.status(200).json({ subjects });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
