"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Clock, CheckCircle2, XCircle } from "lucide-react";
import { getStudentAttendanceByEmail } from "@/services/attendanceApi";

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<{ student: any; records: any[] } | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setLoading(false);
        setData({ error: "missing_email" } as any);
        return;
      }

      try {
        const result = await getStudentAttendanceByEmail(email);
        setData(result);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading attendance data...</div>;

  if (errorMsg) return (
    <div className="p-8 text-center mt-10">
      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-slate-800">Error Fetching Data</h2>
      <p className="text-slate-500 mt-2 max-w-md mx-auto">{errorMsg}</p>
    </div>
  );

  if (data?.error === "missing_email") return (
    <div className="p-8 text-center mt-10">
      <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-slate-800">Session Expired or Incomplete</h2>
      <p className="text-slate-500 mt-2 max-w-md mx-auto">We couldn't find your email address in this session. Please **Logout** and **Sign In again** using your student email (e.g., meha@example.com) to view your attendance.</p>
    </div>
  );

  if (!data || !data.records) return (
    <div className="p-8 text-center">
      <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h2 className="text-lg font-semibold text-slate-700">No Attendance Data Found</h2>
      <p className="text-sm text-slate-500">We couldn't find your attendance records. Please make sure you signed in with the correct email.</p>
    </div>
  );

  const presentCount = data.records.filter(r => r.status === "Present").length;
  const absentCount = data.records.filter(r => r.status === "Absent").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Track your daily attendance and subject-wise metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Overall Percentage</p>
                <h3 className={`text-3xl font-bold mt-1 ${data.student.overall_attendance_percentage < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {data.student.overall_attendance_percentage}%
                </h3>
              </div>
              <div className={`p-3 rounded-full ${data.student.overall_attendance_percentage < 75 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <PieChart className="w-6 h-6" />
              </div>
            </div>
            {data.student.overall_attendance_percentage < 75 && (
              <p className="text-xs font-medium text-red-600 mt-3 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Minimum 75% required
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Classes Attended</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-800">{presentCount}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Classes Missed</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-800">{absentCount}</h3>
              </div>
              <div className="p-3 rounded-full bg-amber-50 text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {data.records.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No records available yet.</p>
          ) : (
            <div className="divide-y">
              {data.records.map((record, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{record.subject_name}</p>
                    <p className="text-xs text-slate-500">{record.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
