"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen } from "lucide-react";
import { useStore } from "@/lib/useStore";
import { cn } from "@/lib/utils";

export default function StudentMaterialsPage() {
  const { materials } = useStore();

  const typeStyle: Record<string, { bg: string; text: string }> = {
    pdf: { bg: "bg-red-500", text: "text-white" },
    ppt: { bg: "bg-orange-500", text: "text-white" },
    doc: { bg: "bg-blue-500", text: "text-white" },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Study Materials</h1>
        <p className="text-slate-500 text-sm mt-1">Notes, slides, and documents shared by your faculty. Updates in real-time.</p>
      </div>
      {materials.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-24 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No materials yet</p>
          <p className="text-slate-400 text-sm mt-1">Your teacher will upload notes and slides here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {materials.map(m => {
            const s = typeStyle[m.type] || { bg: "bg-slate-400", text: "text-white" };
            return (
              <Card key={m.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm", s.bg, s.text)}>
                    {m.type.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.subject}{m.size ? ` · ${m.size}` : ""}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Uploaded by {m.uploadedBy} · {new Date(m.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs shrink-0 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Download className="w-3 h-3 mr-1.5" /> Download
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
