"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, FileText, Target, Sparkles, UploadCloud, FileSearch, 
  MapPin, CheckCircle2, Star, Check 
} from "lucide-react";

export default function PlacementsPage() {
  const [resumeParsed, setResumeParsed] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-amber-500" />
            Placement Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">AI-driven career prep, resume analysis, and application tracking.</p>
        </div>
      </div>

      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-white/50 backdrop-blur border shadow-sm p-1">
          <TabsTrigger value="tracker" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-md">
            <Target className="w-4 h-4 mr-2" /> Application Tracker
          </TabsTrigger>
          <TabsTrigger value="resume" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md">
            <FileSearch className="w-4 h-4 mr-2" /> AI Resume Analyzer
          </TabsTrigger>
          <TabsTrigger value="prep" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md">
            <Sparkles className="w-4 h-4 mr-2" /> AI Interview Prep
          </TabsTrigger>
        </TabsList>

        {/* APPLICATION TRACKER */}
        <TabsContent value="tracker" className="mt-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Add Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Company Name" />
                  <Input placeholder="Role (e.g. SDE-1)" />
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Applied</option>
                    <option>Online Assessment</option>
                    <option>Technical Interview</option>
                    <option>HR Round</option>
                    <option>Offered</option>
                  </select>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">Add Track</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3 space-y-4">
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="flex bg-white">
                  <div className="w-2 bg-blue-500"></div>
                  <div className="p-6 flex-1 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Google</h3>
                      <p className="text-slate-500 font-medium">Software Engineering Intern</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none mb-2 px-4 py-1 text-sm">Online Assessment</Badge>
                      <p className="text-xs text-slate-400">Applied: Oct 10, 2026</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="flex bg-white">
                  <div className="w-2 bg-emerald-500"></div>
                  <div className="p-6 flex-1 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Microsoft</h3>
                      <p className="text-slate-500 font-medium">SDE-1</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none mb-2 px-4 py-1 text-sm">Technical Interview</Badge>
                      <p className="text-xs text-slate-400">Scheduled: Oct 25, 2026</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AI RESUME ANALYZER */}
        <TabsContent value="resume" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md h-fit">
              <CardHeader className="bg-indigo-50 border-b">
                <CardTitle className="text-indigo-900">Upload & Analyze</CardTitle>
                <CardDescription>Get instant ATS scoring and feedback powered by Gemini.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Role</label>
                    <Input placeholder="e.g. Frontend Developer" defaultValue="Frontend Developer" />
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <UploadCloud className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                    <p className="text-sm text-slate-600 font-medium">Drag and drop your PDF resume here</p>
                    <p className="text-xs text-slate-400 mt-1">Max file size 5MB</p>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setResumeParsed(true)}>
                    <Sparkles className="w-4 h-4 mr-2" /> Analyze Resume
                  </Button>
                </div>
              </CardContent>
            </Card>

            {resumeParsed ? (
              <Card className="border-0 shadow-md animate-in slide-in-from-right-8 duration-500">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white pb-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">ATS Analysis Results</CardTitle>
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-emerald-400 shadow-lg">
                      <span className="text-2xl font-black text-indigo-900">78</span>
                    </div>
                  </div>
                  <CardDescription className="text-indigo-100">Match for: Frontend Developer</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-500" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Redux Toolkit", "Server-Side Rendering", "GraphQL", "Jest", "Web Vitals"].map(kw => (
                        <Badge key={kw} variant="outline" className="text-red-600 border-red-200 bg-red-50">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" /> AI Suggestions
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Quantify your achievements. Change "Improved load time" to "Improved initial load time by 45% using Next.js Image optimization."</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Your projects section is strong, but missing live deployment links. Add Vercel/Netlify URLs.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400">
                <FileSearch className="w-16 h-16 mb-4 text-slate-300" />
                <p>Upload a resume to see the AI analysis.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* INTERVIEW PREP */}
        <TabsContent value="prep" className="mt-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <Sparkles className="w-96 h-96" />
            </div>
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-lg"><MapPin className="w-6 h-6 text-white"/></div>
                Preparation Roadmap Generator
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg">AI generates custom 2-week prep plans based on the company's interview patterns.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-xl">
                <Input placeholder="Company (e.g. Amazon)" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 h-12" />
                <Input placeholder="Role (e.g. SDE)" className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 h-12" />
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-8 text-lg shadow-lg shadow-emerald-500/20">
                Generate Custom Roadmap
              </Button>
              
              {/* Mock result */}
              <div className="mt-12 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-md">
                <h3 className="text-xl font-bold text-emerald-400 mb-6">Your Amazon SDE Prep Plan</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 shrink-0">W1</div>
                    <div>
                      <h4 className="font-semibold text-lg">Amazon Leadership Principles & Arrays</h4>
                      <p className="text-slate-400 mt-1">Amazon heavily indexes on behavioral questions using their 16 principles. Practice STAR method answers. For DSA, focus on sliding window and two-pointer array problems.</p>
                      <div className="flex gap-2 mt-3">
                        <Badge className="bg-white/10 hover:bg-white/20 border-0">Two Sum</Badge>
                        <Badge className="bg-white/10 hover:bg-white/20 border-0">3Sum</Badge>
                        <Badge className="bg-white/10 hover:bg-white/20 border-0">Customer Obsession</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 shrink-0">W2</div>
                    <div>
                      <h4 className="font-semibold text-lg">Graphs, Trees & System Design Basics</h4>
                      <p className="text-slate-400 mt-1">Focus on BFS/DFS traversals. For SDE-1, basic object-oriented design is expected (e.g., Design a Parking Lot).</p>
                      <div className="flex gap-2 mt-3">
                        <Badge className="bg-white/10 hover:bg-white/20 border-0">Number of Islands</Badge>
                        <Badge className="bg-white/10 hover:bg-white/20 border-0">OOD Parking Lot</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
