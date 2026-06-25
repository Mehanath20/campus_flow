"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Bell, CalendarDays, Sparkles, BrainCircuit, BookOpen, Clock, PieChart } from "lucide-react";
import { useStore } from "@/lib/useStore";
import { getUserName } from "@/lib/store";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const [name, setName] = useState("Student");
  const [absentRecords, setAbsentRecords] = useState<any[]>([]);
  const { assignments, notices, materials, events } = useStore();

  useEffect(() => { 
    setName(getUserName()); 
    const email = localStorage.getItem("userEmail");
    if (email) {
      import("@/services/attendanceApi").then(api => {
        api.getStudentAttendanceByEmail(email)
          .then(data => {
            const absent = data.records.filter((r: any) => r.status === 'Absent');
            setAbsentRecords(absent);
          })
          .catch(err => console.error("Failed to fetch attendance:", err));
      });
    }
  }, []);

  const getDaysLeft = (deadline: string) => Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  const urgentAssignments = assignments.filter(a => { const d = getDaysLeft(a.deadline); return d >= 0 && d <= 3; });

  const noticeBadge: Record<string, string> = {
    exam: "bg-red-100 text-red-700",
    holiday: "bg-green-100 text-green-700",
    event: "bg-blue-100 text-blue-700",
    general: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {name} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's everything your teacher has shared with you.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Assignments", value: assignments.length, icon: <CheckSquare className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50", href: "/dashboard/assignments" },
          { label: "Study Materials", value: materials.length, icon: <BookOpen className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50", href: "/dashboard/materials" },
          { label: "Notices", value: notices.length, icon: <Bell className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50", href: "/dashboard/notices" },
          { label: "Upcoming Events", value: events.length, icon: <CalendarDays className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50", href: "/dashboard/calendar" },
        ].map(s => (
          <Link key={s.label} href={s.href}>
            <Card className={cn("border shadow-sm hover:shadow-md transition-all cursor-pointer", s.bg)}>
              <CardContent className="p-4 flex justify-between items-start">
                <div>
                  <div className={cn("text-3xl font-bold", s.color)}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
                <span className={s.color}>{s.icon}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Urgent Alert */}
      {absentRecords.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <PieChart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-800">
              🚨 Attendance Alert: You have been marked ABSENT
            </p>
            <ul className="mt-1 space-y-0.5">
              {absentRecords.map((r, i) => (
                <li key={i} className="text-xs text-rose-600 font-medium">
                  · {r.subject_name} on {r.date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {urgentAssignments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              ⚠️ {urgentAssignments.length} assignment{urgentAssignments.length > 1 ? "s are" : " is"} due within 3 days!
            </p>
            <ul className="mt-1 space-y-0.5">
              {urgentAssignments.map(a => (
                <li key={a.id} className="text-xs text-red-600">
                  · {a.title} — {getDaysLeft(a.deadline) === 0 ? "Due today!" : `${getDaysLeft(a.deadline)} day${getDaysLeft(a.deadline) !== 1 ? "s" : ""} left`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Assignments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-500" /> Assignments
            </h2>
            <Link href="/dashboard/assignments" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
          </div>
          {assignments.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <CheckSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No assignments from teachers yet.</p>
            </div>
          ) : (
            assignments.slice(0, 4).map(a => {
              const days = getDaysLeft(a.deadline);
              return (
                <Card key={a.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.subject} · {a.marks} marks</p>
                    </div>
                    <Badge className={cn("text-[10px] shrink-0 font-medium border",
                      days < 0 ? "bg-red-50 text-red-700 border-red-200" :
                      days <= 2 ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-blue-50 text-blue-700 border-blue-200"
                    )}>
                      {days < 0 ? "Overdue" : days === 0 ? "Today!" : `${days}d left`}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Latest Notices */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> Notices from Faculty
            </h2>
            <Link href="/dashboard/notices" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
          </div>
          {notices.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No notices from teachers yet.</p>
            </div>
          ) : (
            notices.slice(0, 4).map(n => (
              <Card key={n.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 flex-1">{n.title}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0", noticeBadge[n.type])}>
                      {n.type}
                    </span>
                  </div>
                  {n.message && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>}
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* AI Study Buddy CTA */}
      <Card className="border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 p-4"><Sparkles className="w-28 h-28" /></div>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> AI Study Buddy
            </h3>
            <p className="text-sm text-indigo-100 mt-1">
              Upload your notes → get AI flashcards, MCQs, and mind maps instantly.
            </p>
          </div>
          <Link href="/study-buddy">
            <button className="bg-white text-indigo-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-md whitespace-nowrap">
              Launch AI →
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
