"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, Zap, Calendar as CalendarIcon, MessageSquare, 
  Workflow, ArrowRight, Activity, Bell, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

const integrations = [
  { name: "Google Calendar", status: "connected", icon: CalendarIcon, color: "text-blue-500", bg: "bg-blue-100" },
  { name: "WhatsApp (Twilio)", status: "connected", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-100" },
  { name: "n8n Webhooks", status: "active", icon: Workflow, color: "text-orange-500", bg: "bg-orange-100" },
];

const workflows = [
  {
    id: 1,
    title: "Deadline Automation",
    description: "Task Created → Calendar Sync → WhatsApp 24h & 1h Reminders",
    active: true,
    nodes: ["Trigger", "Google Calendar", "Twilio WhatsApp", "Wait Node"],
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Notice Broadcast",
    description: "New Notice → Gemini Summary → WhatsApp Broadcast → Calendar Event",
    active: true,
    nodes: ["Webhook", "Gemini AI", "Twilio WhatsApp", "Google Calendar"],
    color: "from-purple-500 to-fuchsia-600"
  },
  {
    id: 3,
    title: "Attendance Risk Alert",
    description: "Attendance Drop → Weekly Check → WhatsApp Warning",
    active: true,
    nodes: ["Cron Job", "DB Check", "Logic", "Twilio WhatsApp"],
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 4,
    title: "Study Session Generator",
    description: "Exam Near → AI Revision Plan → Calendar Blocks → Alerts",
    active: false,
    nodes: ["Cron Job", "Gemini AI", "Google Calendar", "Twilio WhatsApp"],
    color: "from-orange-500 to-rose-600"
  }
];

export default function AutomationPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Workflow className="w-8 h-8 text-slate-700" />
            Automation Hub
          </h1>
          <p className="text-muted-foreground mt-1">Manage your n8n workflows, WhatsApp bots, and Calendar syncs.</p>
        </div>
        <Button className="bg-slate-800 hover:bg-slate-900 text-white shadow-md">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" /> Test Workflows
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {integrations.map((int, i) => (
          <Card key={i} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", int.bg, int.color)}>
                  <int.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{int.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{int.status}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <Settings className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" /> Active Workflows
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {workflows.map((wf) => (
            <Card key={wf.id} className={cn("border-0 shadow-md overflow-hidden relative transition-all", wf.active ? "bg-white" : "bg-slate-50 opacity-70")}>
              {wf.active && (
                <div className={cn("absolute top-0 left-0 w-1 h-full bg-gradient-to-b", wf.color)} />
              )}
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">{wf.title}</CardTitle>
                    <CardDescription className="mt-1 text-slate-500">{wf.description}</CardDescription>
                  </div>
                  <Switch checked={wf.active} />
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {wf.nodes.map((node, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                      <div className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                        {node}
                      </div>
                      {i < wf.nodes.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t bg-slate-50/50 flex justify-between">
                <div className="flex items-center text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1" /> Last ran 2 hours ago
                </div>
                <Button variant="link" className="text-indigo-600 h-auto p-0">View Logs</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
