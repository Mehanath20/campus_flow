import React from 'react';
import { Subject, AttendanceFiltersState } from '../../types/attendance';

interface AttendanceFiltersProps {
  filters: AttendanceFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<AttendanceFiltersState>>;
  subjects: Subject[];
  onLoadStudents: () => void;
  isLoading: boolean;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  filters,
  setFilters,
  subjects,
  onLoadStudents,
  isLoading
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = filters.subjectId && filters.date;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Class Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            name="subjectId"
            value={filters.subjectId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={onLoadStudents}
          disabled={!isFormValid || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Load Students'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceFilters;
