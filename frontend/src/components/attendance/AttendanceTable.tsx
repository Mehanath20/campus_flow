import React from 'react';
import { Student, AttendanceRecord } from '../../types/attendance';
import AttendanceRow from './AttendanceRow';

interface AttendanceTableProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onStatusChange: (studentId: string, status: 'Present' | 'Absent') => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  attendanceRecords,
  onStatusChange,
  onSubmit,
  isSubmitting
}) => {
  if (students.length === 0) {
    return null;
  }

  // Check if all students have been marked
  const isAllMarked = students.every(
    (student) => attendanceRecords.find((record) => record.studentId === student.id)?.status !== null
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => {
              const record = attendanceRecords.find((r) => r.studentId === student.id);
              return (
                <AttendanceRow
                  key={student.id}
                  index={index}
                  student={student}
                  status={record?.status || null}
                  onStatusChange={onStatusChange}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {!isAllMarked && <span className="text-amber-600 font-medium">Please mark attendance for all students before submitting.</span>}
        </div>
        <button
          onClick={onSubmit}
          disabled={!isAllMarked || isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
