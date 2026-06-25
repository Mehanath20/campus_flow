"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Calendar } from "lucide-react";
import { useStore } from "@/lib/useStore";
import { cn } from "@/lib/utils";

export default function StudentAssignmentsPage() {
  const { assignments } = useStore();

  const getDaysLeft = (deadline: string) => Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
        <p className="text-slate-500 text-sm mt-1">All assignments posted by your faculty. Updates in real-time.</p>
      </div>
      {assignments.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-24 text-center">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No assignments yet</p>
          <p className="text-slate-400 text-sm mt-1">Your teacher hasn't posted any assignments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const days = getDaysLeft(a.deadline);
            const overdue = days < 0;
            const urgent = !overdue && days <= 2;
            return (
              <Card key={a.id} className={cn("border shadow-sm hover:shadow-md transition-shadow", overdue && "border-red-200", urgent && "border-amber-200")}>
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      overdue ? "bg-red-100" : urgent ? "bg-amber-100" : "bg-blue-100"
                    )}>
                      <CheckSquare className={cn("w-5 h-5", overdue ? "text-red-500" : urgent ? "text-amber-500" : "text-blue-500")} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{a.subject} · {a.marks} marks</p>
                      {a.description && <p className="text-xs text-slate-400 mt-2 max-w-lg">{a.description}</p>}
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(a.deadline).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Posted by {a.createdBy}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {overdue ? (
                      <Badge className="bg-red-100 text-red-700 border-red-200 border">Overdue</Badge>
                    ) : urgent ? (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
                        {days === 0 ? "Due today!" : `${days} day${days !== 1 ? "s" : ""} left`}
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">
                        {days} day{days !== 1 ? "s" : ""} left
                      </Badge>
                    )}
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
