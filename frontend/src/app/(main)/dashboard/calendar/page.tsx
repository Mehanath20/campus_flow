"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    assignment: { icon: <CheckSquare className="w-5 h-5" />, bg: "bg-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    exam:       { icon: <Bell className="w-5 h-5" />,        bg: "bg-red-500",  badge: "bg-red-50 text-red-700 border-red-200" },
    event:      { icon: <CalendarDays className="w-5 h-5" />, bg: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Calendar</h1>
        <p className="text-slate-500 text-sm mt-1">
          All assignments, exams, and events from your faculty — auto-synced in real-time.
        </p>
      </div>

      <div className="flex items-center gap-5 text-xs text-slate-500">
        {[
          { color: "bg-blue-500", label: "Assignment" },
          { color: "bg-red-500", label: "Exam" },
          { color: "bg-amber-500", label: "Event" },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={cn("w-2.5 h-2.5 rounded-full", l.color)} /> {l.label}
          </span>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-24 text-center">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No events yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Events appear here automatically when your teacher posts assignments or notices.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, evts]) => (
          <div key={month} className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{month}</h2>
            {evts.map(e => {
              const cfg = typeConfig[e.type as keyof typeof typeConfig] || typeConfig.event;
              const d = new Date(e.date);
              return (
                <Card key={e.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Date block */}
                    <div className="text-center shrink-0 w-12">
                      <div className="text-xs text-slate-400 uppercase font-medium">
                        {d.toLocaleDateString("en-IN", { month: "short" })}
                      </div>
                      <div className="text-2xl font-black text-slate-800 leading-none">{d.getDate()}</div>
                      <div className="text-[10px] text-slate-400 uppercase">
                        {d.toLocaleDateString("en-IN", { weekday: "short" })}
                      </div>
                    </div>

                    {/* Color bar */}
                    <div className={cn("w-1 h-12 rounded-full shrink-0", cfg.bg)} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{e.title}</p>
                      {e.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{e.description}</p>}
                    </div>

                    <Badge variant="outline" className={cn("text-xs capitalize shrink-0 border", cfg.badge)}>
                      {e.type}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
