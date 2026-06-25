"use client";
import { useEffect, useState } from "react";
import { CheckSquare, Bell, CalendarDays, Sparkles, BrainCircuit, BookOpen, Clock, PieChart, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { useStore } from "@/lib/useStore";
import { getUserName } from "@/lib/store";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { key: "assignments", label: "Assignments", icon: CheckSquare, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.15)", href: "/dashboard/assignments" },
  { key: "materials",   label: "Materials",   icon: BookOpen,    color: "#0ea5e9", bg: "rgba(14,165,233,0.08)",  border: "rgba(14,165,233,0.15)",  href: "/dashboard/materials" },
  { key: "notices",     label: "Notices",     icon: Bell,        color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)", href: "/dashboard/notices" },
  { key: "events",      label: "Events",      icon: CalendarDays,color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)", href: "/dashboard/calendar" },
];

export default function StudentDashboard() {
  const [name, setName] = useState("Student");
  const [absentRecords, setAbsentRecords] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const { assignments, notices, materials, events } = useStore();

  useEffect(() => {
    setName(getUserName());
    setTimeout(() => setVisible(true), 100);

    const email = localStorage.getItem("userEmail");
    if (email) {
      import("@/services/attendanceApi").then(api => {
        api.getStudentAttendanceByEmail(email)
          .then(data => setAbsentRecords(data.records.filter((r: any) => r.status === 'Absent')))
          .catch(() => {});
      });
    }
  }, []);

  const getDaysLeft = (deadline: string) => Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  const urgentAssignments = assignments.filter(a => { const d = getDaysLeft(a.deadline); return d >= 0 && d <= 3; });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const emoji = hour < 12 ? "☀️" : hour < 18 ? "👋" : "🌙";

  const storeValues: Record<string, number> = {
    assignments: assignments.length,
    materials: materials.length,
    notices: notices.length,
    events: events.length,
  };

  return (
    <div className={cn("space-y-6 max-w-5xl mx-auto transition-all duration-700", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>

      {/* Header */}
      <div className="flex items-start justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#2d2b55" }}>{greeting}, {name} {emoji}</h1>
          <p className="text-sm mt-1" style={{ color: "#9580c4" }}>Here's everything your teacher has shared with you.</p>
        </div>
        <div className="glass-card hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          style={{ borderRadius: "14px", color: "#7c3aed" }}>
          <TrendingUp className="w-4 h-4" /> Student Dashboard
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={s.key} href={s.href}>
              <div className="glass-card p-4 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both", borderRadius: "20px" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <ArrowRight className="w-4 h-4" style={{ color: "#c4b5fd" }} />
                </div>
                <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>{storeValues[s.key]}</div>
                <div className="text-xs font-semibold" style={{ color: "#9580c4" }}>{s.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Attendance Alert */}
      {absentRecords.length > 0 && (
        <div className="glass-card p-4 flex items-start gap-3 animate-scale-in"
          style={{ borderRadius: "16px", background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.18)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(244,63,94,0.12)" }}>
            <PieChart className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-600">🚨 Attendance Alert — You were marked Absent</p>
            <ul className="mt-1 space-y-0.5">
              {absentRecords.map((r, i) => (
                <li key={i} className="text-xs text-rose-500">· {r.subject_name} on {r.date}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Deadline Warning */}
      {urgentAssignments.length > 0 && (
        <div className="glass-card p-4 flex items-start gap-3 animate-scale-in"
          style={{ borderRadius: "16px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.12)" }}>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-600">
              ⚠️ {urgentAssignments.length} assignment{urgentAssignments.length > 1 ? "s" : ""} due within 3 days!
            </p>
            {urgentAssignments.map(a => (
              <p key={a.id} className="text-xs text-amber-500 mt-0.5">
                · {a.title} — {getDaysLeft(a.deadline) === 0 ? "Due today!" : `${getDaysLeft(a.deadline)} day(s) left`}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-5 animate-slide-up delay-300" style={{ animationFillMode: "both" }}>

        {/* Assignments */}
        <div className="glass-card overflow-hidden" style={{ borderRadius: "20px" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(167,139,250,0.12)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)" }}>
                <CheckSquare className="w-4 h-4 text-violet-600" />
              </div>
              <span className="text-sm font-bold" style={{ color: "#2d2b55" }}>Assignments</span>
            </div>
            <Link href="/dashboard/assignments"
              className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-2" style={{ color: "#a78bfa" }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-3 space-y-2">
            {assignments.length === 0 ? (
              <div className="py-10 text-center">
                <CheckSquare className="w-8 h-8 mx-auto mb-2" style={{ color: "#ddd6fe" }} />
                <p className="text-xs" style={{ color: "#c4b5fd" }}>No assignments yet</p>
              </div>
            ) : assignments.slice(0, 4).map(a => {
              const days = getDaysLeft(a.deadline);
              return (
                <div key={a.id} className="flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all hover:bg-white/60"
                  style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(167,139,250,0.1)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "#2d2b55" }}>{a.title}</p>
                    <p className="text-xs" style={{ color: "#b09fd4" }}>{a.subject} · {a.marks} marks</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-xl shrink-0 ml-2",
                    days < 0 ? "badge-rose" : days <= 2 ? "badge-amber" : "badge-lavender"
                  )}>
                    {days < 0 ? "Overdue" : days === 0 ? "Today!" : `${days}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notices */}
        <div className="glass-card overflow-hidden" style={{ borderRadius: "20px" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(167,139,250,0.12)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.1)" }}>
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-sm font-bold" style={{ color: "#2d2b55" }}>Notices</span>
            </div>
            <Link href="/dashboard/notices"
              className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-2" style={{ color: "#a78bfa" }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-3 space-y-2">
            {notices.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: "#ddd6fe" }} />
                <p className="text-xs" style={{ color: "#c4b5fd" }}>No notices yet</p>
              </div>
            ) : notices.slice(0, 4).map(n => (
              <div key={n.id} className="px-3 py-2.5 rounded-2xl transition-all hover:bg-white/60"
                style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(167,139,250,0.1)" }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold flex-1" style={{ color: "#2d2b55" }}>{n.title}</p>
                  <span className={cn("shrink-0",
                    n.type === "exam" ? "badge-rose" : n.type === "holiday" ? "badge-emerald" :
                    n.type === "event" ? "badge-lavender" : "text-[10px] font-bold px-2 py-0.5 rounded-xl bg-slate-100 text-slate-500"
                  )}>{n.type}</span>
                </div>
                {n.message && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#b09fd4" }}>{n.message}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI CTA */}
      <div className="glass-card p-6 flex items-center justify-between relative overflow-hidden animate-slide-up delay-400"
        style={{
          borderRadius: "24px",
          animationFillMode: "both",
          background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(167,139,250,0.08) 100%)",
          border: "1px solid rgba(124,58,237,0.2)"
        }}>
        <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none">
          <Sparkles className="w-44 h-44 text-violet-600 animate-spin-slow" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)" }}>
              <BrainCircuit className="w-4 h-4 text-violet-600" />
            </div>
            <h3 className="text-lg font-black" style={{ color: "#2d2b55" }}>AI Study Buddy</h3>
          </div>
          <p className="text-sm" style={{ color: "#9580c4" }}>Upload notes → get flashcards, MCQs & mind maps instantly.</p>
        </div>
        <Link href="/study-buddy" className="relative z-10 shrink-0">
          <button className="glass-btn px-5 py-2.5 rounded-2xl text-sm whitespace-nowrap flex items-center gap-2">
            <Zap className="w-4 h-4" /> Launch AI
          </button>
        </Link>
      </div>
    </div>
  );
}
