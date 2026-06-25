"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckSquare, BookOpen, Bell, PieChart, Plus, Send,
  UploadCloud, FileText, Trash2, CalendarDays, AlertTriangle, X
} from "lucide-react";
import {
  addAssignment, deleteAssignment,
  addNotice, deleteNotice,
  addMaterial, deleteMaterial,
  getEvents, getUserName,
  Assignment, Notice, UploadedMaterial, CalendarEvent
} from "@/lib/store";
import { useStore } from "@/lib/useStore";
import { cn } from "@/lib/utils";

type Tab = "assignments" | "materials" | "notices" | "attendance" | "events";

export default function TeacherDashboard() {
  const [tab, setTab] = useState<Tab>("assignments");
  const [teacherName, setTeacherName] = useState("Teacher");
  const { assignments, notices, materials, events, refresh } = useStore();

  // Assignment form
  const [aTitle, setATitle] = useState("");
  const [aSubject, setASubject] = useState("");
  const [aMarks, setAMarks] = useState("");
  const [aDeadline, setADeadline] = useState("");
  const [aDesc, setADesc] = useState("");
  const [aBranch, setABranch] = useState("CSE");
  const [aYear, setAYear] = useState("2");
  const [aSection, setASection] = useState("A");

  // Notice form
  const [nTitle, setNTitle] = useState("");
  const [nMsg, setNMsg] = useState("");
  const [nType, setNType] = useState<"exam" | "holiday" | "event" | "general">("general");
  const [nDate, setNDate] = useState("");

  // Material form
  const [mSubject, setMSubject] = useState("");
  const [mFile, setMFile] = useState<File | null>(null);

  useEffect(() => { setTeacherName(getUserName()); }, []);

  const handleAddAssignment = async () => {
    if (!aTitle.trim() || !aSubject.trim() || !aDeadline) {
      alert("Please fill in Title, Subject, and Deadline.");
      return;
    }
    
    // Save to local store for UI real-time updates
    addAssignment({
      title: aTitle.trim(),
      subject: aSubject.trim(),
      marks: Number(aMarks) || 0,
      deadline: aDeadline,
      description: aDesc.trim(),
      createdBy: teacherName,
    });

    // Call backend API
    try {
      await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aTitle.trim(),
          description: aDesc.trim(),
          subject: aSubject.trim(),
          deadline: aDeadline,
          branch: aBranch,
          year: Number(aYear),
          section: aSection
        })
      });
      // Ignoring response for now to keep it simple, local store updates UI anyway
    } catch (e) {
      console.error("Error creating assignment in backend:", e);
    }

    setATitle(""); setASubject(""); setAMarks(""); setADeadline(""); setADesc("");
  };

  const handleAddNotice = () => {
    if (!nTitle.trim() || !nDate) {
      alert("Please fill in Title and Date.");
      return;
    }
    addNotice({ title: nTitle.trim(), message: nMsg.trim(), type: nType, date: nDate, createdBy: teacherName });
    setNTitle(""); setNMsg(""); setNDate(""); setNType("general");
  };

  const handleAddMaterial = () => {
    if (!mSubject.trim() || !mFile) {
      alert("Please enter a subject and select a file.");
      return;
    }
    const ext = mFile.name.split(".").pop()?.toLowerCase() || "";
    const type: UploadedMaterial["type"] = ext === "pdf" ? "pdf" : (ext === "ppt" || ext === "pptx") ? "ppt" : "doc";
    const size = mFile.size > 1024 * 1024
      ? `${(mFile.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(mFile.size / 1024).toFixed(0)} KB`;
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

  const noticeBadge: Record<string, string> = {
    exam: "bg-red-100 text-red-700",
    holiday: "bg-green-100 text-green-700",
    event: "bg-blue-100 text-blue-700",
    general: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Good morning, {teacherName} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">
          Everything you publish here is <span className="font-semibold text-emerald-600">instantly visible to all students</span>.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Assignments", value: assignments.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Materials Shared", value: materials.length, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Notices Posted", value: notices.length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Calendar Events", value: events.length, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <Card key={s.label} className={cn("border shadow-sm", s.bg)}>
            <CardContent className="p-4">
              <div className={cn("text-3xl font-bold", s.color)}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              tab === t.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            )}
          >
            {t.icon} {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn("text-xs rounded-full px-1.5 py-0.5 font-bold",
                tab === t.id ? "bg-white/30 text-white" : "bg-indigo-100 text-indigo-700"
              )}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── ASSIGNMENTS ── */}
      {tab === "assignments" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" /> New Assignment
              </CardTitle>
              <CardDescription className="text-xs">Students will see this instantly on their dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Input placeholder="Assignment title *" value={aTitle} onChange={e => setATitle(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Subject *" value={aSubject} onChange={e => setASubject(e.target.value)} />
                <Input type="number" placeholder="Max marks" value={aMarks} onChange={e => setAMarks(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Deadline *</label>
                <Input type="date" value={aDeadline} onChange={e => setADeadline(e.target.value)} min={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Branch</label>
                  <select value={aBranch} onChange={e => setABranch(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Year</label>
                  <select value={aYear} onChange={e => setAYear(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Section</label>
                  <select value={aSection} onChange={e => setASection(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Instructions (optional)"
                value={aDesc}
                onChange={e => setADesc(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10" onClick={handleAddAssignment}>
                <Send className="w-4 h-4 mr-2" /> Publish to Students
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-600">
              Published ({assignments.length}) — visible to all students
            </h3>
            {assignments.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm">
                <CheckSquare className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                No assignments yet. Create one to get started.
              </div>
            ) : (
              assignments.map(a => (
                <Card key={a.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{a.subject} · {a.marks} marks</p>
                      {a.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{a.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700 bg-blue-50">
                          Due: {new Date(a.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAssignment(a.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── MATERIALS ── */}
      {tab === "materials" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-purple-500" /> Upload Study Material
              </CardTitle>
              <CardDescription className="text-xs">Students can view and download from their Materials page.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Input placeholder="Subject *" value={mSubject} onChange={e => setMSubject(e.target.value)} />
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center bg-purple-50/30">
                <FileText className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-3">PDF, PPTX, DOCX up to 50MB</p>
                <input
                  id="material-file-input"
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={e => setMFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                />
                {mFile && (
                  <p className="mt-2 text-xs text-purple-700 font-medium">✓ {mFile.name}</p>
                )}
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 h-10" onClick={handleAddMaterial}>
                <UploadCloud className="w-4 h-4 mr-2" /> Publish to Students
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-600">
              Published ({materials.length}) — visible to all students
            </h3>
            {materials.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm">
                <FileText className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                No materials uploaded yet.
              </div>
            ) : (
              materials.map(m => (
                <Card key={m.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold",
                      m.type === "pdf" ? "bg-red-500" : m.type === "ppt" ? "bg-orange-500" : "bg-blue-500"
                    )}>
                      {m.type.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.subject}{m.size ? ` · ${m.size}` : ""}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{new Date(m.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => deleteMaterial(m.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── NOTICES ── */}
      {tab === "notices" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" /> Post a Notice
              </CardTitle>
              <CardDescription className="text-xs">
                Broadcast to all students instantly. Also creates a calendar event.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Input placeholder="Notice title *" value={nTitle} onChange={e => setNTitle(e.target.value)} />
              <textarea
                placeholder="Message / details (optional)"
                value={nMsg}
                onChange={e => setNMsg(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
                  <select
                    value={nType}
                    onChange={e => setNType(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="general">General</option>
                    <option value="exam">Internal Exam</option>
                    <option value="holiday">Holiday</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Date *</label>
                  <Input type="date" value={nDate} onChange={e => setNDate(e.target.value)} />
                </div>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 h-10" onClick={handleAddNotice}>
                <Bell className="w-4 h-4 mr-2" /> Broadcast to All Students
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-600">
              Posted ({notices.length}) — visible to all students
            </h3>
            {notices.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm">
                <Bell className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                No notices posted yet.
              </div>
            ) : (
              notices.map(n => (
                <Card key={n.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase", noticeBadge[n.type])}>
                            {n.type}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                        {n.message && <p className="text-xs text-slate-500 mt-1">{n.message}</p>}
                      </div>
                      <button
                        onClick={() => deleteNotice(n.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── ATTENDANCE ── */}
      {tab === "attendance" && (
        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-500" /> Attendance Management
            </CardTitle>
            <CardDescription>Upload attendance sheet. AI flags at-risk students and sends alerts.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="border-2 border-dashed border-rose-200 rounded-xl p-12 flex flex-col items-center text-center bg-rose-50/30 max-w-lg mx-auto">
              <UploadCloud className="w-12 h-12 text-rose-300 mb-4" />
              <p className="text-sm font-semibold text-slate-700 mb-1">Upload Attendance Sheet</p>
              <p className="text-xs text-slate-400 mb-4">Excel/CSV · Format: Roll No, Name, Present Days, Total Days</p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="block text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
              />
              <Button className="mt-6 bg-rose-600 hover:bg-rose-700">
                <AlertTriangle className="w-4 h-4 mr-2" /> Analyze & Alert At-Risk Students
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── CALENDAR ── */}
      {tab === "events" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600">All Calendar Events ({events.length})</h3>
            <p className="text-xs text-slate-400">Auto-created from assignments & notices</p>
          </div>
          {events.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm">
              <CalendarDays className="w-10 h-10 mx-auto text-slate-200 mb-3" />
              Events are automatically added when you post assignments or notices.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => (
                <Card key={e.id} className="border shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white",
                      e.type === "assignment" ? "bg-blue-500" : e.type === "exam" ? "bg-red-500" : "bg-amber-500"
                    )}>
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{e.title}</p>
                      {e.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{e.description}</p>}
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(e.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize shrink-0">{e.type}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
