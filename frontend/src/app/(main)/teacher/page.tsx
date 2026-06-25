"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckSquare, BookOpen, Bell, PieChart, Plus, Send,
  UploadCloud, FileText, Trash2, CalendarDays, AlertTriangle, Download
} from "lucide-react";
import {
  addAssignment, deleteAssignment,
  addNotice, deleteNotice,
  addMaterial, deleteMaterial,
  deleteEvent,
  getUserName,
  Assignment, Notice, UploadedMaterial, CalendarEvent
} from "@/lib/store";
import { useStore } from "@/lib/useStore";
import { cn } from "@/lib/utils";

type Tab = "assignments" | "materials" | "notices" | "attendance" | "events";

function TeacherDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "assignments";
  const [tab, setTab] = useState<Tab>(initialTab);
  
  useEffect(() => {
    const tabParam = searchParams.get("tab") as Tab;
    if (tabParam && ["assignments", "materials", "notices", "attendance", "events"].includes(tabParam)) {
      setTab(tabParam);
    }
  }, [searchParams]);

  const [teacherName, setTeacherName] = useState("Teacher");
  const { assignments, notices, materials, events } = useStore();

  const [aTitle, setATitle] = useState("");
  const [aSubject, setASubject] = useState("");
  const [aMarks, setAMarks] = useState("");
  const [aDeadline, setADeadline] = useState("");
  const [aDesc, setADesc] = useState("");
  const [aBranch, setABranch] = useState("CSE");
  const [aYear, setAYear] = useState("2");
  const [aSection, setASection] = useState("A");

  const [nTitle, setNTitle] = useState("");
  const [nMsg, setNMsg] = useState("");
  const [nType, setNType] = useState<"exam" | "holiday" | "event" | "general">("general");
  const [nDate, setNDate] = useState("");

  const [mSubject, setMSubject] = useState("");
  const [mFile, setMFile] = useState<File | null>(null);

  useEffect(() => { setTeacherName(getUserName()); }, []);

  const handleAddAssignment = async () => {
    if (!aTitle.trim() || !aSubject.trim() || !aDeadline) {
      alert("Please fill in Title, Subject, and Deadline.");
      return;
    }
    addAssignment({
      title: aTitle.trim(), subject: aSubject.trim(),
      marks: Number(aMarks) || 0, deadline: aDeadline,
      description: aDesc.trim(), createdBy: teacherName,
    });
    try {
      await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: aTitle.trim(), description: aDesc.trim(), subject: aSubject.trim(), deadline: aDeadline, branch: aBranch, year: Number(aYear), section: aSection })
      });
    } catch (e) { console.error(e); }
    setATitle(""); setASubject(""); setAMarks(""); setADeadline(""); setADesc("");
  };

  const handleAddNotice = () => {
    if (!nTitle.trim() || !nDate) { alert("Please fill in Title and Date."); return; }
    addNotice({ title: nTitle.trim(), message: nMsg.trim(), type: nType, date: nDate, createdBy: teacherName });
    setNTitle(""); setNMsg(""); setNDate(""); setNType("general");
  };

  const handleAddMaterial = () => {
    if (!mSubject.trim() || !mFile) { alert("Please enter a subject and select a file."); return; }
    const ext = mFile.name.split(".").pop()?.toLowerCase() || "";
    const type: UploadedMaterial["type"] = ext === "pdf" ? "pdf" : (ext === "ppt" || ext === "pptx") ? "ppt" : "doc";
    const size = mFile.size > 1024 * 1024 ? `${(mFile.size / (1024 * 1024)).toFixed(1)} MB` : `${(mFile.size / 1024).toFixed(0)} KB`;
    addMaterial({ name: mFile.name, subject: mSubject.trim(), uploadedBy: teacherName, type, size });
    setMSubject(""); setMFile(null);
    (document.getElementById("material-file-input") as HTMLInputElement).value = "";
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "assignments", label: "Assignments", icon: <CheckSquare className="w-4 h-4" />, count: assignments.length },
    { id: "materials", label: "Course Materials", icon: <BookOpen className="w-4 h-4" />, count: materials.length },
    { id: "notices", label: "Notices & Alerts", icon: <Bell className="w-4 h-4" />, count: notices.length },
    { id: "attendance", label: "Attendance", icon: <PieChart className="w-4 h-4" /> },
    { id: "events", label: "Calendar", icon: <CalendarDays className="w-4 h-4" />, count: events.length },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-black" style={{ color: "#2d2b55" }}>Good morning, {teacherName} 👋</h1>
        <p className="text-sm mt-1" style={{ color: "#9580c4" }}>
          Everything you publish here is{" "}
          <span className="font-bold" style={{ color: "#7c3aed" }}>instantly visible to all students</span>.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Assignments", value: assignments.length, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.15)" },
          { label: "Materials Shared",   value: materials.length,   color: "#8b5cf6", bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.15)" },
          { label: "Notices Posted",     value: notices.length,     color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.15)" },
          { label: "Calendar Events",    value: events.length,      color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.15)" },
        ].map((s, i) => (
          <div key={s.label} className="glass-card p-4 animate-slide-up"
            style={{ borderRadius: "20px", animationDelay: `${i * 0.07}s`, animationFillMode: "both", background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold" style={{ color: "#9580c4" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200",
              tab === t.id ? "glass-btn shadow-md" : "hover:scale-[1.02]"
            )}
            style={tab !== t.id ? { background: "rgba(255,255,255,0.55)", border: "1px solid rgba(167,139,250,0.2)", color: "#7c6fa0", backdropFilter: "blur(12px)" } : undefined}
          >
            {t.icon} {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn("text-xs rounded-xl px-2 py-0.5 font-bold",
                tab === t.id ? "bg-white/25 text-white" : "bg-violet-100 text-violet-600"
              )}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── ASSIGNMENTS ── */}
      {tab === "assignments" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card" style={{ borderRadius: "20px" }}>
            <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(167,139,250,0.12)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)" }}>
                <Plus className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2d2b55" }}>New Assignment</p>
                <p className="text-xs" style={{ color: "#b09fd4" }}>Students will see this instantly.</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <input placeholder="Assignment title *" value={aTitle} onChange={e => setATitle(e.target.value)}
                className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Subject *" value={aSubject} onChange={e => setASubject(e.target.value)}
                  className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }} />
                <input type="number" placeholder="Max marks" value={aMarks} onChange={e => setAMarks(e.target.value)}
                  className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "#9580c4" }}>Deadline *</label>
                <input type="date" value={aDeadline} onChange={e => setADeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Branch", val: aBranch, set: setABranch, opts: ["CSE","ECE","ME"] },
                  { label: "Year",   val: aYear,   set: setAYear,   opts: ["1","2","3","4"] },
                  { label: "Section",val: aSection, set: setASection,opts: ["A","B","C"] },
                ].map(({ label, val, set, opts }) => (
                  <div key={label}>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: "#9580c4" }}>{label}</label>
                    <select value={val} onChange={e => set(e.target.value)}
                      className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }}>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <textarea placeholder="Instructions (optional)" value={aDesc} onChange={e => setADesc(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-2xl text-sm min-h-[72px] resize-none" style={{ color: "#2d2b55" }} />
              <button className="glass-btn w-full h-11 rounded-2xl text-sm flex items-center justify-center gap-2" onClick={handleAddAssignment}>
                <Send className="w-4 h-4" /> Publish to Students
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: "#9580c4" }}>Published ({assignments.length}) — visible to students</p>
            {assignments.length === 0 ? (
              <div className="glass-card py-16 text-center" style={{ borderRadius: "20px" }}>
                <CheckSquare className="w-10 h-10 mx-auto mb-3" style={{ color: "#ddd6fe" }} />
                <p className="text-sm" style={{ color: "#c4b5fd" }}>No assignments yet. Create one above.</p>
              </div>
            ) : assignments.map(a => (
              <div key={a.id} className="glass-card p-4 flex items-start gap-3" style={{ borderRadius: "16px" }}>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-sm" style={{ color: "#2d2b55" }}>{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#b09fd4" }}>{a.subject} · {a.marks} marks</p>
                  {a.description && <p className="text-xs mt-1 line-clamp-1" style={{ color: "#c4b5fd" }}>{a.description}</p>}
                  <span className="badge-lavender mt-2 inline-block">
                    Due: {new Date(a.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <button onClick={() => deleteAssignment(a.id)}
                  className="p-1.5 rounded-xl transition-all hover:bg-rose-50 hover:scale-110 shrink-0">
                  <Trash2 className="w-4 h-4" style={{ color: "#ddd6fe" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MATERIALS ── */}
      {tab === "materials" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card" style={{ borderRadius: "20px" }}>
            <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(167,139,250,0.12)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)" }}>
                <UploadCloud className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2d2b55" }}>Upload Study Material</p>
                <p className="text-xs" style={{ color: "#b09fd4" }}>Instantly visible on student dashboards.</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <input placeholder="Subject *" value={mSubject} onChange={e => setMSubject(e.target.value)}
                className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }} />
              <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(139,92,246,0.04)", border: "2px dashed rgba(139,92,246,0.2)" }}>
                <FileText className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-xs mb-3" style={{ color: "#b09fd4" }}>PDF, PPTX, DOCX up to 50MB</p>
                <input id="material-file-input" type="file" accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={e => setMFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200"
                  style={{ color: "#9580c4" }} />
                {mFile && <p className="mt-2 text-xs font-semibold text-violet-600">✓ {mFile.name}</p>}
              </div>
              <button className="glass-btn w-full h-11 rounded-2xl text-sm flex items-center justify-center gap-2" onClick={handleAddMaterial}>
                <UploadCloud className="w-4 h-4" /> Publish to Students
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: "#9580c4" }}>Published ({materials.length}) — visible to students</p>
            {materials.length === 0 ? (
              <div className="glass-card py-16 text-center" style={{ borderRadius: "20px" }}>
                <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "#ddd6fe" }} />
                <p className="text-sm" style={{ color: "#c4b5fd" }}>No materials uploaded yet.</p>
              </div>
            ) : materials.map(m => (
              <div key={m.id} className="glass-card p-4 flex items-center gap-3" style={{ borderRadius: "16px" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: m.type === "pdf" ? "#ef4444" : m.type === "ppt" ? "#f97316" : "#3b82f6" }}>
                  {m.type.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: "#2d2b55" }}>{m.name}</p>
                  <p className="text-xs" style={{ color: "#b09fd4" }}>{m.subject}{m.size ? ` · ${m.size}` : ""}</p>
                </div>
                <button onClick={() => {
                  const content = `This is a dummy file for ${m.name} (${m.type.toUpperCase()}).\n\nIn a real app, this would be the actual downloaded file from the backend/S3 bucket.`;
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = m.name;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }} className="p-1.5 rounded-xl hover:bg-violet-50 hover:scale-110 transition-all shrink-0 text-violet-400 hover:text-violet-600" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => deleteMaterial(m.id)} className="p-1.5 rounded-xl hover:bg-rose-50 hover:scale-110 transition-all shrink-0 text-rose-300 hover:text-rose-500" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NOTICES ── */}
      {tab === "notices" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card" style={{ borderRadius: "20px" }}>
            <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(167,139,250,0.12)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.1)" }}>
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2d2b55" }}>Post a Notice</p>
                <p className="text-xs" style={{ color: "#b09fd4" }}>Broadcast to all students instantly.</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <input placeholder="Notice title *" value={nTitle} onChange={e => setNTitle(e.target.value)}
                className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }} />
              <textarea placeholder="Message / details (optional)" value={nMsg} onChange={e => setNMsg(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-2xl text-sm min-h-[72px] resize-none" style={{ color: "#2d2b55" }} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: "#9580c4" }}>Category</label>
                  <select value={nType} onChange={e => setNType(e.target.value as any)}
                    className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }}>
                    <option value="general">General</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: "#9580c4" }}>Date *</label>
                  <input type="date" value={nDate} onChange={e => setNDate(e.target.value)}
                    className="glass-input w-full h-10 px-3 rounded-2xl text-sm" style={{ color: "#2d2b55" }} />
                </div>
              </div>
              <button className="glass-btn w-full h-11 rounded-2xl text-sm flex items-center justify-center gap-2" onClick={handleAddNotice}>
                <Bell className="w-4 h-4" /> Broadcast to All Students
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: "#9580c4" }}>Posted ({notices.length}) — visible to students</p>
            {notices.length === 0 ? (
              <div className="glass-card py-16 text-center" style={{ borderRadius: "20px" }}>
                <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: "#ddd6fe" }} />
                <p className="text-sm" style={{ color: "#c4b5fd" }}>No notices posted yet.</p>
              </div>
            ) : notices.map(n => (
              <div key={n.id} className="glass-card p-4" style={{ borderRadius: "16px" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(n.type === "exam" ? "badge-rose" : n.type === "holiday" ? "badge-emerald" : n.type === "event" ? "badge-lavender" : "text-[10px] font-bold px-2 py-0.5 rounded-xl bg-slate-100 text-slate-500")}>
                        {n.type}
                      </span>
                      <span className="text-xs" style={{ color: "#c4b5fd" }}>
                        {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="font-bold text-sm" style={{ color: "#2d2b55" }}>{n.title}</p>
                    {n.message && <p className="text-xs mt-1" style={{ color: "#b09fd4" }}>{n.message}</p>}
                  </div>
                  <button onClick={() => deleteNotice(n.id)} className="p-1.5 rounded-xl hover:bg-rose-50 hover:scale-110 transition-all shrink-0">
                    <Trash2 className="w-4 h-4" style={{ color: "#ddd6fe" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* ── CALENDAR ── */}
      {tab === "events" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold" style={{ color: "#2d2b55" }}>All Events ({events.length})</p>
            <p className="text-xs" style={{ color: "#b09fd4" }}>Auto-created from assignments & notices</p>
          </div>
          {events.length === 0 ? (
            <div className="glass-card py-16 text-center" style={{ borderRadius: "20px" }}>
              <CalendarDays className="w-10 h-10 mx-auto mb-3" style={{ color: "#ddd6fe" }} />
              <p className="text-sm" style={{ color: "#c4b5fd" }}>Events appear when you post assignments or notices.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => (
                <div key={e.id} className="glass-card p-4 flex items-center gap-3" style={{ borderRadius: "16px" }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white"
                    style={{ background: e.type === "assignment" ? "#7c3aed" : e.type === "exam" ? "#ef4444" : "#f59e0b" }}>
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: "#2d2b55" }}>{e.title}</p>
                    {e.description && <p className="text-xs truncate" style={{ color: "#b09fd4" }}>{e.description}</p>}
                    <p className="text-xs mt-0.5" style={{ color: "#c4b5fd" }}>
                      {new Date(e.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(e.type === "assignment" ? "badge-lavender" : e.type === "exam" ? "badge-rose" : "badge-amber")}>
                      {e.type}
                    </span>
                    <button onClick={() => deleteEvent(e.id)} className="p-1.5 rounded-xl hover:bg-rose-50 hover:scale-110 transition-all shrink-0 text-rose-300 hover:text-rose-500" title="Delete Event">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Dashboard...</div>}>
      <TeacherDashboardContent />
    </Suspense>
  );
}
