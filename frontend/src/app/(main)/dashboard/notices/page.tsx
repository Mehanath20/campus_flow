"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useStore } from "@/lib/useStore";
import { cn } from "@/lib/utils";

const typeStyles: Record<string, { badge: string; border: string; bg: string }> = {
  exam:    { badge: "bg-red-100 text-red-700",     border: "border-l-red-500",   bg: "bg-red-50/20" },
  holiday: { badge: "bg-green-100 text-green-700", border: "border-l-green-500", bg: "bg-green-50/20" },
  event:   { badge: "bg-blue-100 text-blue-700",   border: "border-l-blue-500",  bg: "bg-blue-50/20" },
  general: { badge: "bg-slate-100 text-slate-700", border: "border-l-slate-400", bg: "" },
};

export default function StudentNoticesPage() {
  const { notices } = useStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notices & Alerts</h1>
        <p className="text-slate-500 text-sm mt-1">Important announcements from your faculty. Updates in real-time.</p>
      </div>
      {notices.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-24 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No notices yet</p>
          <p className="text-slate-400 text-sm mt-1">Your faculty will post important announcements here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map(n => {
            const s = typeStyles[n.type] || typeStyles.general;
            return (
              <Card key={n.id} className={cn("border shadow-sm hover:shadow-md transition-shadow border-l-4", s.border)}>
                <CardContent className={cn("p-5", s.bg)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize", s.badge)}>
                          {n.type}
                        </span>
                        <span className="text-xs text-slate-400">from {n.createdBy}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-base leading-snug">{n.title}</h3>
                      {n.message && <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{n.message}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(n.date).toLocaleDateString("en-IN", { year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
