"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Target, FileText, Calendar as CalendarIcon, ClipboardList, 
  BrainCircuit, Activity, Clock, Plus, Zap, AlertTriangle, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for UI
const mockDeadlinePlan = [
  { day: 1, title: "Research & Analysis", desc: "Gather requirements and read relevant papers.", hours: 2 },
  { day: 2, title: "Drafting Structure", desc: "Create the outline and boilerplate code.", hours: 3 },
  { day: 3, title: "Core Development", desc: "Implement main algorithms.", hours: 4 },
  { day: 4, title: "Testing & Debugging", desc: "Run test suites and fix issues.", hours: 2 },
  { day: 5, title: "Final Review", desc: "Review guidelines and submit.", hours: 1 },
];

export default function ProductivityPage() {
  const [noticeText, setNoticeText] = useState("");
  const [showNoticeResult, setShowNoticeResult] = useState(false);
  const [attendanceInput, setAttendanceInput] = useState({ attended: 28, total: 40 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-rose-500" />
            Smart Productivity
          </h1>
          <p className="text-muted-foreground mt-1">AI-driven actionable intelligence to keep you ahead.</p>
        </div>
      </div>

      <Tabs defaultValue="deadlines" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14 bg-white/50 backdrop-blur border shadow-sm p-1">
          <TabsTrigger value="deadlines" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-md">
            <Target className="w-4 h-4 mr-2" /> Deadline Planner
          </TabsTrigger>
          <TabsTrigger value="notices" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md">
            <FileText className="w-4 h-4 mr-2" /> Notice Intelligence
          </TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md">
            <Activity className="w-4 h-4 mr-2" /> Attendance Risk
          </TabsTrigger>
          <TabsTrigger value="study" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
            <CalendarIcon className="w-4 h-4 mr-2" /> Study Planner
          </TabsTrigger>
        </TabsList>

        {/* DEADLINE PLANNER */}
        <TabsContent value="deadlines" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 shadow-md border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-orange-900">New Task Setup</CardTitle>
                <CardDescription>Let AI break down your assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignment Title</label>
                  <Input placeholder="e.g. Distributed Systems Lab" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Days until Due</label>
                  <Input type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Hard</option>
                    <option>Medium</option>
                    <option>Easy</option>
                  </select>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 shadow-md">
                  <Zap className="w-4 h-4 mr-2" /> Generate Plan
                </Button>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <ClipboardList className="w-6 h-6 text-orange-500" /> AI Generated Plan
              </h3>
              <div className="space-y-3">
                {mockDeadlinePlan.map((task, i) => (
                  <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="flex">
                      <div className="bg-orange-100 text-orange-700 w-16 flex flex-col items-center justify-center font-bold p-2 shrink-0">
                        <span className="text-xs uppercase tracking-wider">Day</span>
                        <span className="text-xl">{task.day}</span>
                      </div>
                      <div className="p-4 flex-1 bg-white flex justify-between items-center border border-l-0 rounded-r-xl border-slate-100">
                        <div>
                          <h4 className="font-semibold text-slate-800">{task.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{task.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4" /> {task.hours}h
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* NOTICE INTELLIGENCE */}
        <TabsContent value="notices" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-indigo-50 border-b">
                <CardTitle className="text-indigo-900">Paste Notice</CardTitle>
                <CardDescription>AI will extract dates, venues, and create tasks.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea 
                  placeholder="Paste the long text from your college WhatsApp group or email here..." 
                  className="min-h-[300px] resize-none"
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                />
              </CardContent>
              <CardFooter className="bg-slate-50 border-t">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowNoticeResult(true)}>
                  Extract Information
                </Button>
              </CardFooter>
            </Card>

            {showNoticeResult ? (
              <Card className="border-0 shadow-md animate-in slide-in-from-right-8 duration-500 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" /> Extracted Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-2">Summary</h4>
                    <p className="text-sm text-indigo-800/80">
                      The Annual Hackathon "CodeFest 2026" is scheduled. Registration closes on Friday. All computer science students are encouraged to participate.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-xl">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Important Dates</h4>
                      <p className="text-sm font-medium">Registration: Oct 15</p>
                      <p className="text-sm font-medium">Event: Oct 20-21</p>
                    </div>
                    <div className="p-3 border rounded-xl">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Venue</h4>
                      <p className="text-sm font-medium">Main Auditorium</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Action Items Added to Tasks</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Form a team of 3 members
                      </div>
                      <div className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pay registration fee ($10)
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="w-4 h-4 mr-2" /> Add to Google Calendar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400">
                <FileText className="w-16 h-16 mb-4 text-slate-300" />
                <p>Paste a notice to see the magic.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ATTENDANCE PREDICTOR */}
        <TabsContent value="attendance" className="mt-6">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-2">Attendance Risk Predictor</h2>
              <p className="text-emerald-100">Know exactly how many classes you can skip.</p>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Classes Attended</label>
                  <Input 
                    type="number" 
                    value={attendanceInput.attended} 
                    onChange={e => setAttendanceInput({...attendanceInput, attended: parseInt(e.target.value) || 0})}
                    className="h-14 text-2xl font-bold text-center" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Total Conducted</label>
                  <Input 
                    type="number" 
                    value={attendanceInput.total} 
                    onChange={e => setAttendanceInput({...attendanceInput, total: parseInt(e.target.value) || 1})}
                    className="h-14 text-2xl font-bold text-center" 
                  />
                </div>
              </div>

              {/* Dynamic Logic for Demo */}
              {(() => {
                const percentage = (attendanceInput.attended / attendanceInput.total) * 100;
                const isSafe = percentage >= 75;
                const canSkip = Math.floor((100 * attendanceInput.attended - 75 * attendanceInput.total) / 75);
                const toAttend = Math.ceil((75 * attendanceInput.total - 100 * attendanceInput.attended) / 25);

                return (
                  <div className={cn("p-6 rounded-2xl border-2 flex items-start gap-4", 
                    isSafe ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
                  )}>
                    <div className={cn("p-3 rounded-full shrink-0", isSafe ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}>
                      {isSafe ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                    </div>
                    <div>
                      <h3 className={cn("text-2xl font-bold mb-1", isSafe ? "text-emerald-800" : "text-red-800")}>
                        {percentage.toFixed(1)}% <span className="text-lg font-medium">Current</span>
                      </h3>
                      <p className={cn("text-base", isSafe ? "text-emerald-700" : "text-red-700")}>
                        {isSafe 
                          ? `Safe zone! You can comfortably miss ${canSkip > 0 ? canSkip : '0'} upcoming classes without falling below 75%.` 
                          : `Warning! You must attend the next ${toAttend > 0 ? toAttend : '1'} consecutive classes to get back to 75%.`
                        }
                      </p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* STUDY PLANNER */}
        <TabsContent value="study" className="mt-6">
          <Card className="border-0 shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-blue-50/50 border-b pb-6">
              <CardTitle className="text-2xl text-blue-900">AI Weekly Study Planner</CardTitle>
              <CardDescription>Automatically optimized based on your deadlines, exams, and difficulty levels.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-7 divide-x divide-slate-100 border-b">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                  <div key={day} className="p-4 bg-slate-50 text-center font-bold text-slate-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-7 divide-x divide-slate-100">
                {/* Mock Schedule Columns */}
                {Array.from({length: 7}).map((_, dayIdx) => (
                  <div key={dayIdx} className="p-3 space-y-3 min-h-[300px] bg-white">
                    {dayIdx === 0 || dayIdx === 3 ? (
                      <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm hover:shadow-md transition-all cursor-pointer">
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none mb-2">2 Hours</Badge>
                        <h4 className="font-semibold text-purple-900">OS Revision</h4>
                        <p className="text-xs text-purple-700/80 mt-1">Deadlock Avoidance & Bankers Algo</p>
                      </div>
                    ) : null}
                    
                    {dayIdx === 1 || dayIdx === 4 || dayIdx === 6 ? (
                      <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-sm hover:shadow-md transition-all cursor-pointer">
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none mb-2">1.5 Hours</Badge>
                        <h4 className="font-semibold text-orange-900">Assignment</h4>
                        <p className="text-xs text-orange-700/80 mt-1">Complete Distributed Systems Code</p>
                      </div>
                    ) : null}

                    {dayIdx === 5 ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm hover:shadow-md transition-all cursor-pointer">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none mb-2">3 Hours</Badge>
                        <h4 className="font-semibold text-emerald-900">Mock Test</h4>
                        <p className="text-xs text-emerald-700/80 mt-1">Placement Aptitude Prep</p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 justify-between py-4">
              <span className="text-sm text-slate-500">Plan generated based on 15 hours available this week.</span>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Plus className="w-4 h-4 mr-2" /> Adjust Constraints
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
