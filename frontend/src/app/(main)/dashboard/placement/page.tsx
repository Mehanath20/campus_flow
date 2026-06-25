"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Code, Calculator, Server, Loader2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const categories = [
  { id: "dsa", label: "Data Structures & Algorithms", icon: Code, desc: "Arrays, Trees, DP, Graphs" },
  { id: "aptitude", label: "Quantitative Aptitude", icon: Calculator, desc: "Math, Logic, Puzzles" },
  { id: "system-design", label: "System Design", icon: Server, desc: "Architecture, Scalability" }
];

export default function PlacementPrepPage() {
  const [selectedCategory, setSelectedCategory] = useState("dsa");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrep, setGeneratedPrep] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a specific topic.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ai/study-material`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: topic.trim(), 
          type: 'placement',
          category: categories.find(c => c.id === selectedCategory)?.label || "General"
        }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setGeneratedPrep(data.result);
      } else {
        alert(data.error || "Failed to generate placement prep.");
      }
    } catch (error: any) {
      console.error(error);
      alert("Error connecting to AI engine.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-rose-500" />
          Placement Preparation AI
        </h1>
        <p className="text-slate-500 mt-1">Targeted interview questions, concepts, and guides powered by OpenRouter.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map(c => {
          const Icon = c.icon;
          const isActive = selectedCategory === c.id;
          return (
            <Card 
              key={c.id} 
              className={cn("cursor-pointer transition-all border-2", isActive ? "border-rose-500 bg-rose-50" : "hover:border-rose-200")}
              onClick={() => setSelectedCategory(c.id)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isActive ? "bg-rose-600 text-white" : "bg-rose-100 text-rose-600")}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm", isActive ? "text-rose-900" : "text-slate-800")}>{c.label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input 
              placeholder={`E.g. Binary Search Trees, Time Speed Distance, Microservices...`} 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="h-12 bg-slate-50 border-slate-200 text-base"
              onKeyDown={e => e.key === "Enter" && handleGenerate()}
            />
            <Button className="h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white font-medium" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Briefcase className="w-5 h-5 mr-2" />}
              {isLoading ? "Generating Guide..." : "Generate Guide"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedPrep && (
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-4 text-white flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <Code className="w-5 h-5" /> AI Generated Study Guide: {topic}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setGeneratedPrep("")} className="text-white hover:bg-white/20">
              <RefreshCcw className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
          <CardContent className="p-8 bg-slate-50">
            <div className="prose prose-rose max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600">
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-slate-800" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-8 text-rose-900 border-b pb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-6 text-rose-800" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4 text-slate-800" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline 
                      ? <code className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      : <div className="bg-slate-900 rounded-xl overflow-hidden my-4"><code className="block p-4 text-sm text-emerald-400 font-mono overflow-x-auto" {...props} /></div>,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-rose-300 pl-4 italic text-slate-500 my-4" {...props} />,
                }}
              >
                {generatedPrep}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
