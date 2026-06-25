"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, Activity, Users, TrendingUp, AlertCircle, 
  Brain, ShieldCheck, GraduationCap, Zap, CalendarPlus, UserPlus 
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PieChart className="w-8 h-8 text-fuchsia-500" />
            Analytics & Predictors
          </h1>
          <p className="text-muted-foreground mt-1">Advanced AI evaluating your performance, predicting risks, and finding study partners.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Productivity Analytics Scores */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold text-slate-500">Productivity Score</CardDescription>
            <CardTitle className="text-4xl text-fuchsia-600">85<span className="text-lg text-slate-400">/100</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={85} className="h-2 bg-fuchsia-100" />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500"/> +5% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold text-slate-500">Learning Retention</CardDescription>
            <CardTitle className="text-4xl text-blue-600">78<span className="text-lg text-slate-400">/100</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={78} className="h-2 bg-blue-100" />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">Based on MCQ performance</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold text-slate-500">Attendance Health</CardDescription>
            <CardTitle className="text-4xl text-emerald-600">92<span className="text-lg text-slate-400">%</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={92} className="h-2 bg-emerald-100" />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">Safe zone</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold text-slate-500">Placement Readiness</CardDescription>
            <CardTitle className="text-4xl text-amber-600">65<span className="text-lg text-slate-400">/100</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={65} className="h-2 bg-amber-100" />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500"/> Needs DSA improvement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PREDICTIVE AI */}
        <Card className="border-0 shadow-md bg-slate-900 text-white overflow-hidden relative h-full">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Brain className="w-64 h-64" />
          </div>
          <CardHeader className="relative z-10 border-b border-white/10 bg-white/5">
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" /> AI Predictive Engine
            </CardTitle>
            <CardDescription className="text-slate-400">Machine learning models predicting your academic future.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold">Deadline Risk Prediction</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Likelihood of missing upcoming OS Assignment</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Low Risk (12%)</Badge>
              </div>

              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><GraduationCap className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold">Midterm Performance</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Predicted grade based on study hours & quiz scores</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">A Grade (88%)</Badge>
              </div>

              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400"><Activity className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold">Placement Prediction</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Probability of clearing Tier 1 company OA</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Moderate (55%)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STUDY GROUP MATCHER */}
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-indigo-50 border-b pb-6">
            <CardTitle className="text-xl text-indigo-900 flex items-center gap-2">
              <Users className="w-5 h-5" /> Smart Study Group Matcher
            </CardTitle>
            <CardDescription>AI finds peers with complementary skills and matching availability.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Operating Systems</option>
                    <option>Computer Networks</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Input placeholder="e.g. Memory Management" />
                </div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Find Matches</Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Top Matches</h4>
              
              <div className="flex items-center justify-between p-3 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">RS</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Rahul S.</h4>
                    <p className="text-xs text-slate-500">Expert in OS • Free tomorrow at 5PM</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <UserPlus className="w-4 h-4" /> Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">PM</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Priya M.</h4>
                    <p className="text-xs text-slate-500">Intermediate • Needs help with Deadlocks</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <UserPlus className="w-4 h-4" /> Connect
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t flex gap-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              <CalendarPlus className="w-4 h-4 mr-2" /> Auto-schedule Session
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
