import React from 'react';
import { Student, AttendanceStatus } from '../../types/attendance';

interface AttendanceRowProps {
  student: Student;
  status: AttendanceStatus;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  index: number;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({ student, status, onStatusChange, index }) => {
  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {student.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {student.register_number}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {student.email || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
        {student.password || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={`attendance-${student.id}`}
              value="Present"
              checked={status === 'Present'}
              onChange={() => onStatusChange(student.id, 'Present')}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span className="ml-2 text-sm font-medium text-green-700">Present</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={`attendance-${student.id}`}
              value="Absent"
              checked={status === 'Absent'}
              onChange={() => onStatusChange(student.id, 'Absent')}
              className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm font-medium text-red-700">Absent</span>
          </label>
        </div>
      </td>
    </tr>
  );
};

export default AttendanceRow;
