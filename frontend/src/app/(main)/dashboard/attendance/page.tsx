"use client";

import { useEffect, useState } from "react";
import { PieChart, Clock, CheckCircle2, XCircle } from "lucide-react";
import { getStudentAttendanceByEmail } from "@/services/attendanceApi";
import { cn } from "@/lib/utils";

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-3xl bg-violet-100 flex items-center justify-center mb-4">
        <PieChart className="w-8 h-8 text-violet-500 animate-spin-slow" />
      </div>
      <p className="font-semibold text-violet-900">Loading attendance data...</p>
    </div>
  );

  if (errorMsg) {
    if (errorMsg.includes('Student not found')) {
      return (
        <div className="glass-card p-12 text-center mt-10 rounded-3xl max-w-2xl mx-auto border-none shadow-lg">
          <div className="w-20 h-20 rounded-3xl bg-violet-100 mx-auto flex items-center justify-center mb-5 border border-violet-200">
            <PieChart className="w-10 h-10 text-violet-500" />
          </div>
          <h2 className="text-2xl font-black text-violet-900">No Attendance Data Found</h2>
          <p className="font-medium text-violet-700/70 mt-2 max-w-md mx-auto">We couldn't find your attendance records for the email address you signed in with.</p>
        </div>
      );
    }
    return (
      <div className="glass-card p-12 text-center mt-10 rounded-3xl max-w-2xl mx-auto border-none shadow-lg">
        <div className="w-20 h-20 rounded-3xl bg-red-100 mx-auto flex items-center justify-center mb-5 border border-red-200">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-violet-900">Error Fetching Data</h2>
        <p className="font-medium text-violet-700/70 mt-2 max-w-md mx-auto">{errorMsg}</p>
      </div>
    );
  }

  if (data?.error === "missing_email") return (
    <div className="glass-card p-12 text-center mt-10 rounded-3xl max-w-2xl mx-auto border-none shadow-lg">
      <div className="w-20 h-20 rounded-3xl bg-rose-100 mx-auto flex items-center justify-center mb-5 border border-rose-200">
        <XCircle className="w-10 h-10 text-rose-500" />
      </div>
      <h2 className="text-2xl font-black text-violet-900">Session Expired or Incomplete</h2>
      <p className="font-medium text-violet-700/70 mt-2 max-w-md mx-auto">We couldn't find your email address in this session. Please **Logout** and **Sign In again** using your student email (e.g., meha@example.com) to view your attendance.</p>
    </div>
  );

  if (!data || !data.records) return (
    <div className="glass-card p-12 text-center mt-10 rounded-3xl max-w-2xl mx-auto border-none shadow-lg">
      <div className="w-20 h-20 rounded-3xl bg-violet-100 mx-auto flex items-center justify-center mb-5 border border-violet-200">
        <PieChart className="w-10 h-10 text-violet-500" />
      </div>
      <h2 className="text-2xl font-black text-violet-900">No Attendance Data Found</h2>
      <p className="font-medium text-violet-700/70 mt-2 max-w-md mx-auto">We couldn't find your attendance records. Please make sure you signed in with the correct email.</p>
    </div>
  );

  const presentCount = data.records.filter(r => r.status === "Present").length;
  const absentCount = data.records.filter(r => r.status === "Absent").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: "#2d2b55" }}>
          <PieChart className="w-8 h-8 text-violet-500" />
          My Attendance
        </h1>
        <p className="mt-1 font-medium" style={{ color: "#7c6fa0" }}>Track your daily attendance and subject-wise metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: "#7c6fa0" }}>Overall Percentage</p>
              <h3 className={cn("text-4xl font-black mt-1 tracking-tight", data.student.overall_attendance_percentage < 75 ? 'text-rose-600' : 'text-emerald-500')}>
                {data.student.overall_attendance_percentage}%
              </h3>
            </div>
            <div className={cn("p-4 rounded-2xl flex items-center justify-center", data.student.overall_attendance_percentage < 75 ? 'bg-rose-100 text-rose-500 border border-rose-200' : 'bg-emerald-100 text-emerald-500 border border-emerald-200')}>
              <PieChart className="w-7 h-7" />
            </div>
          </div>
          {data.student.overall_attendance_percentage < 75 && (
            <div className="mt-4 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <p className="text-xs font-bold text-rose-600">Minimum 75% required</p>
            </div>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: "#7c6fa0" }}>Classes Attended</p>
              <h3 className="text-4xl font-black mt-1 tracking-tight" style={{ color: "#2d2b55" }}>{presentCount}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-blue-100 text-blue-500 border border-blue-200 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: "#7c6fa0" }}>Classes Missed</p>
              <h3 className="text-4xl font-black mt-1 tracking-tight" style={{ color: "#2d2b55" }}>{absentCount}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-amber-100 text-amber-500 border border-amber-200 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border-none shadow-sm">
        <div className="p-6 border-b border-violet-100/50" style={{ background: "rgba(255,255,255,0.2)" }}>
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "#2d2b55" }}>
            <PieChart className="w-6 h-6 text-violet-500" />
            Recent Attendance Records
          </h3>
        </div>
        <div className="p-6">
          {data.records.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-3xl bg-violet-100 mx-auto flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-violet-400" />
              </div>
              <p className="font-bold text-violet-900">No records available yet.</p>
              <p className="text-sm text-violet-700/70 mt-1">Your attendance will appear here once marked by faculty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.records.map((record, i) => (
                <div key={i} className="p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white/40" style={{ border: "1px solid rgba(167,139,250,0.15)" }}>
                  <div>
                    <p className="text-base font-bold" style={{ color: "#2d2b55" }}>{record.subject_name}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: "#a78bfa" }}>{record.date}</p>
                  </div>
                  <span className={cn("px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider", record.status === 'Present' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-rose-100 text-rose-600 border border-rose-200')}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
