'use client';

import React, { useState, useEffect } from 'react';
import { 
  Subject, 
  Student, 
  AttendanceFiltersState, 
  AttendanceRecord,
  MarkAttendancePayload
} from '@/types/attendance';
import { 
  getSubjects, 
  getStudentsForAttendance, 
  markAttendance 
} from '@/services/attendanceApi';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import AttendanceTable from '@/components/attendance/AttendanceTable';
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
    <div className="container mx-auto max-w-5xl animate-in fade-in duration-500 space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: "#2d2b55" }}>
          <UserCheck className="w-8 h-8 text-violet-500" />
          Mark Attendance
        </h1>
        <p className="mt-1 font-medium" style={{ color: "#7c6fa0" }}>Select class details and mark daily attendance for students.</p>
      </div>

      {error && (
        <div className="glass-card border-l-4 border-l-rose-500 p-4 rounded-2xl flex items-start">
          <AlertCircle className="h-5 w-5 text-rose-500 mr-3 mt-0.5 shrink-0" />
          <p className="text-sm font-bold text-rose-700">{error}</p>
        </div>
      )}

      {isSuccess && (
        <div className="glass-card p-8 rounded-3xl mb-6">
          <div className="flex items-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mr-4" />
            <h2 className="text-2xl font-black text-emerald-600">Attendance submitted successfully.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card rounded-2xl p-5 flex items-center bg-white/40">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: "rgba(59,130,246,0.1)" }}>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
                <p className="text-2xl font-black" style={{ color: "#2d2b55" }}>{submissionStats.total}</p>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-5 flex items-center bg-white/40">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: "rgba(16,185,129,0.1)" }}>
                <UserCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Present</p>
                <p className="text-2xl font-black text-emerald-600">{submissionStats.present}</p>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-5 flex items-center bg-white/40">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ background: "rgba(244,63,94,0.1)" }}>
                <UserX className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Absent</p>
                <p className="text-2xl font-black text-rose-600">{submissionStats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-sm font-bold text-emerald-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
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
