"use client";
import { CalendarDays, CheckSquare, Bell } from "lucide-react";
import { useStore } from "@/lib/useStore";
import { CalendarEvent } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function StudentCalendarPage() {
  const { events } = useStore();

  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group by month-year
  const grouped = sorted.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    const key = new Date(e.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    (acc[key] = acc[key] || []).push(e);
    return acc;
  }, {});

  const typeConfig = {
    assignment: { icon: <CheckSquare className="w-5 h-5" />, bg: "bg-blue-500", badge: "badge-lavender" },
    exam:       { icon: <Bell className="w-5 h-5" />,        bg: "bg-red-500",  badge: "badge-rose" },
    event:      { icon: <CalendarDays className="w-5 h-5" />, bg: "bg-amber-500", badge: "badge-amber" },
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: "#2d2b55" }}>
          <CalendarDays className="w-8 h-8 text-violet-500" />
          My Calendar
        </h1>
        <p className="mt-1 font-medium" style={{ color: "#7c6fa0" }}>
          All assignments, exams, and events from your faculty — auto-synced in real-time.
        </p>
      </div>

      <div className="flex items-center gap-5 text-xs font-bold" style={{ color: "#9580c4" }}>
        {[
          { color: "bg-violet-500", label: "Assignment" },
          { color: "bg-rose-500", label: "Exam" },
          { color: "bg-amber-500", label: "Event" },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-2">
            <span className={cn("w-3 h-3 rounded-md", l.color)} /> {l.label}
          </span>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="glass-card rounded-3xl p-24 text-center border-dashed border-2 border-violet-200/50 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-100 text-violet-600 flex items-center justify-center mb-5 border border-violet-200">
            <CalendarDays className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black mb-2" style={{ color: "#2d2b55" }}>No events yet</h3>
          <p className="font-medium max-w-md" style={{ color: "#7c6fa0" }}>
            Events appear here automatically when your teacher posts assignments or notices.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, evts]) => (
          <div key={month} className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest px-2" style={{ color: "#a78bfa" }}>{month}</h2>
            {evts.map(e => {
              const cfg = typeConfig[e.type as keyof typeof typeConfig] || typeConfig.event;
              const d = new Date(e.date);
              return (
                <div key={e.id} className="glass-card rounded-3xl p-5 flex items-center gap-5 transition-transform hover:scale-[1.01]">
                  {/* Date block */}
                  <div className="text-center shrink-0 w-14 p-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.4)", border: "1px solid rgba(167,139,250,0.2)" }}>
                    <div className="text-xs uppercase font-black" style={{ color: "#a78bfa" }}>
                      {d.toLocaleDateString("en-IN", { month: "short" })}
                    </div>
                    <div className="text-2xl font-black leading-none my-1" style={{ color: "#2d2b55" }}>{d.getDate()}</div>
                    <div className="text-[10px] font-bold uppercase" style={{ color: "#9580c4" }}>
                      {d.toLocaleDateString("en-IN", { weekday: "short" })}
                    </div>
                  </div>

                  {/* Color bar */}
                  <div className={cn("w-1.5 h-14 rounded-full shrink-0", e.type === "assignment" ? "bg-violet-500" : e.type === "exam" ? "bg-rose-500" : "bg-amber-500")} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate" style={{ color: "#2d2b55" }}>{e.title}</p>
                    {e.description && <p className="text-sm font-medium mt-0.5 truncate" style={{ color: "#7c6fa0" }}>{e.description}</p>}
                  </div>

                  <span className={cn("shrink-0", cfg.badge)}>
                    {e.type}
                  </span>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
