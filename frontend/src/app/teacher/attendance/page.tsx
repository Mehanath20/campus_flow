'use client';

import React, { useState, useEffect } from 'react';
import { 
  Subject, 
  Student, 
  AttendanceFiltersState, 
  AttendanceRecord,
  MarkAttendancePayload
} from '../../../types/attendance';
import { 
  getSubjects, 
  getStudentsForAttendance, 
  markAttendance 
} from '../../../services/attendanceApi';
import AttendanceFilters from '../../../components/attendance/AttendanceFilters';
import AttendanceTable from '../../../components/attendance/AttendanceTable';
import { CheckCircle2, AlertCircle, Users, UserCheck, UserX } from 'lucide-react';

export default function TeacherAttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Submission results state
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionStats, setSubmissionStats] = useState({ present: 0, absent: 0, total: 0 });

  const [filters, setFilters] = useState<AttendanceFiltersState>({
    subjectId: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err: any) {
        setError('Failed to load subjects. Please try again.');
        console.error(err);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleLoadStudents = async () => {
    setIsLoadingStudents(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      const data = await getStudentsForAttendance();
      setStudents(data);
      
      // Initialize attendance records
      const initialRecords: AttendanceRecord[] = data.map(student => ({
        studentId: student.id,
        status: null // No default selection, forces teacher to mark
      }));
      setAttendanceRecords(initialRecords);
      
      if (data.length === 0) {
        setError('No students found for the selected class.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load students.');
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSubmitAttendance = async () => {
    // Validate that all students have been marked
    const unmarkedStudents = attendanceRecords.filter(r => r.status === null);
    if (unmarkedStudents.length > 0) {
      setError('Please mark attendance for all students before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: MarkAttendancePayload = {
      subjectId: filters.subjectId,
      date: filters.date,
      // We can safely cast because we validated all are marked
      attendance: attendanceRecords as { studentId: string; status: 'Present' | 'Absent' }[]
    };

    try {
      await markAttendance(payload);
      
      // Calculate stats for success message
      const presentCount = payload.attendance.filter(a => a.status === 'Present').length;
      const absentCount = payload.attendance.filter(a => a.status === 'Absent').length;
      
      setSubmissionStats({
        present: presentCount,
        absent: absentCount,
        total: payload.attendance.length
      });
      
      setIsSuccess(true);
      // Clear students to force reload for next class
      setStudents([]);
    } catch (err: any) {
      setError(err.message || 'Failed to submit attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mark Attendance</h1>
        <p className="text-gray-500 mt-2">Select class details and mark daily attendance for students.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-50 border border-green-200 p-6 mb-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500 mr-3" />
            <h2 className="text-2xl font-semibold text-green-800">Attendance submitted successfully.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-md shadow-sm flex items-center border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{submissionStats.total}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm flex items-center border border-gray-100">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Present Students</p>
                <p className="text-2xl font-bold text-green-700">{submissionStats.present}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm flex items-center border border-gray-100">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Absent Students</p>
                <p className="text-2xl font-bold text-red-700">{submissionStats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-green-700 bg-green-100 p-3 rounded inline-block font-medium">
            Attendance updated & absent notifications processing via n8n.
          </div>
        </div>
      )}

      {!isSuccess && (
        <AttendanceFilters
          filters={filters}
          setFilters={setFilters}
          subjects={subjects}
          onLoadStudents={handleLoadStudents}
          isLoading={isLoadingStudents || isLoadingSubjects}
        />
      )}

      {students.length > 0 && !isSuccess && (
        <AttendanceTable
          students={students}
          attendanceRecords={attendanceRecords}
          onStatusChange={handleStatusChange}
          onSubmit={handleSubmitAttendance}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
