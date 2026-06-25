"use client";
import { Download, BookOpen } from "lucide-react";
import { useStore } from "@/lib/useStore";
import { cn } from "@/lib/utils";

export default function StudentMaterialsPage() {
  const { materials } = useStore();

  const typeStyle: Record<string, { bg: string; text: string }> = {
    pdf: { bg: "bg-red-50 text-red-600 border border-red-200", text: "text-red-600" },
    ppt: { bg: "bg-orange-50 text-orange-600 border border-orange-200", text: "text-orange-600" },
    doc: { bg: "bg-blue-50 text-blue-600 border border-blue-200", text: "text-blue-600" },
  };

  const handleDownload = (name: string, type: string) => {
    // Generate a dummy blob since we only have metadata in localStorage
    const content = `This is a dummy file for ${name} (${type.toUpperCase()}).\n\nIn a real app, this would be the actual downloaded file from the backend/S3 bucket.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: "#2d2b55" }}>
          <BookOpen className="w-8 h-8 text-violet-500" />
          Study Materials
        </h1>
        <p className="mt-1 font-medium" style={{ color: "#7c6fa0" }}>Notes, slides, and documents shared by your faculty. Updates in real-time.</p>
      </div>

      {materials.length === 0 ? (
        <div className="glass-card rounded-3xl p-24 text-center border-dashed border-2 border-violet-200/50 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-100 text-violet-600 flex items-center justify-center mb-5 border border-violet-200">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black mb-2" style={{ color: "#2d2b55" }}>No materials yet</h3>
          <p className="font-medium max-w-md" style={{ color: "#7c6fa0" }}>
            Your teacher will upload notes and slides here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {materials.map(m => {
            const s = typeStyle[m.type] || { bg: "bg-violet-50 text-violet-600 border border-violet-200", text: "text-violet-600" };
            return (
              <div key={m.id} className="glass-card rounded-3xl p-5 flex items-center gap-5 transition-all hover:scale-[1.01] hover:shadow-lg">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm", s.bg)}>
                  {m.type.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg truncate" style={{ color: "#2d2b55" }}>{m.name}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "#7c6fa0" }}>{m.subject}{m.size ? ` · ${m.size}` : ""}</p>
                  <p className="text-[11px] font-medium mt-1 uppercase tracking-wider" style={{ color: "#a78bfa" }}>
                    Uploaded by {m.uploadedBy} · {new Date(m.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <button onClick={() => handleDownload(m.name, m.type)} className="glass-btn h-10 px-4 rounded-xl text-sm shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
