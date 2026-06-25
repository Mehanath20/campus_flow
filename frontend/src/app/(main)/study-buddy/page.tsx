"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, MessageSquare, BrainCircuit, PenTool, BookOpen, Send, Bot, User, FileText, ChevronRight, CheckCircle2, RotateCcw, Network, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function StudyBuddyPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    { role: "bot", content: "Hi! I'm your AI Tutor. Upload a PDF and ask me anything about your notes." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // States for generation
  const [flashcards, setFlashcards] = useState<{q: string, a: string}[]>([]);
  const [flashcardTopic, setFlashcardTopic] = useState("");
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);

  const [mcqs, setMcqs] = useState<{q: string, options: string[], correctAnswer: string}[]>([]);
  const [mcqTopic, setMcqTopic] = useState("");
  const [isGeneratingMCQs, setIsGeneratingMCQs] = useState(false);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);

  const [examTopic, setExamTopic] = useState("");
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [examNotes, setExamNotes] = useState("");

  const [mindMapTopic, setMindMapTopic] = useState("");
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const [mindMapData, setMindMapData] = useState<any>(null);

  const handleGenerateFlashcards = async () => {
    const topicToUse = flashcardTopic.trim() || "Core concepts and definitions";
    setIsGeneratingFlashcards(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/study-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToUse, type: 'flashcards' }),
      });
      const data = await res.json();
      if (res.ok && data.result && Array.isArray(data.result)) {
        setFlashcards(data.result.map((f: any) => ({ q: f.question, a: f.answer })));
        setActiveCard(0);
        setIsFlipped(false);
      } else {
        alert(data.error || "Failed to generate flashcards.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error generating flashcards.");
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const handleGenerateMCQs = async () => {
    const topicToUse = mcqTopic.trim() || "Important topics and key details";
    setIsGeneratingMCQs(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/study-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToUse, type: 'mcq' }),
      });
      const data = await res.json();
      if (res.ok && data.result && Array.isArray(data.result)) {
        setMcqs(data.result.map((m: any) => ({ q: m.question, options: m.options, correctAnswer: m.correctAnswer })));
        setCurrentMcqIndex(0);
        setSelectedMcqOption(null);
      } else {
        alert(data.error || "Failed to generate MCQs.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error generating MCQs.");
    } finally {
      setIsGeneratingMCQs(false);
    }
  };

  const handleGenerateNotes = async () => {
    const topicToUse = examTopic.trim() || "Comprehensive chapter summary";
    setIsGeneratingNotes(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/study-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToUse, type: 'notes' }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setExamNotes(data.result);
      } else {
        alert(data.error || "Failed to generate notes.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error generating notes.");
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const handleGenerateMindMap = async () => {
    const topicToUse = mindMapTopic.trim() || "Main hierarchical structure and themes";
    setIsGeneratingMindMap(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/study-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToUse, type: 'mindmap' }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setMindMapData(data.result);
      } else {
        alert(data.error || "Failed to generate mind map.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error generating mind map.");
    } finally {
      setIsGeneratingMindMap(false);
    }
  };

  const handleNextCard = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setActiveCard((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFileName(file.name);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('http://localhost:5000/api/ai/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('PDF Uploaded successfully! You can now ask questions about it.');
      } else {
        alert('Failed to upload PDF.');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading PDF.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatHistory(prev => [...prev, { role: "bot", content: data.answer }]);
      } else {
        setChatHistory(prev => [...prev, { role: "bot", content: "Sorry, I encountered an error." }]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: "bot", content: "Error communicating with server." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: "#2d2b55" }}>
            <Sparkles className="w-8 h-8 text-violet-500" />
            AI Knowledge Engine
          </h1>
          <p className="mt-1 font-medium" style={{ color: "#7c6fa0" }}>Your personal, context-aware AI tutor powered by Gemini & RAG.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />
          <button className="glass-btn px-4 py-2 rounded-xl text-sm flex items-center" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />} 
            {isUploading ? "Uploading..." : "Upload PDF"}
          </button>
          <div className="glass-card px-3 py-2 text-sm font-semibold rounded-xl flex items-center border-none shadow-sm" style={{ color: "#7c6fa0" }}>Connected: 12 Documents</div>
          <div className="px-3 py-2 text-sm font-semibold rounded-xl flex items-center border border-violet-200 bg-violet-50 text-violet-700">Gemini 2.5 Flash</div>
        </div>
      </div>

      <Tabs defaultValue="tutor" className="w-full">
        <TabsList className="glass-card flex w-full h-14 p-1.5 gap-1 mb-6 border-none shadow-md">
          <TabsTrigger value="tutor" className="data-[state=active]:glass-nav-active data-[state=active]:text-violet-900 rounded-xl flex-1 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all">
            <MessageSquare className="w-4 h-4 mr-2" /> AI Tutor
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="data-[state=active]:glass-nav-active data-[state=active]:text-violet-900 rounded-xl flex-1 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all">
            <BrainCircuit className="w-4 h-4 mr-2" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="mcq" className="data-[state=active]:glass-nav-active data-[state=active]:text-violet-900 rounded-xl flex-1 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all">
            <CheckCircle2 className="w-4 h-4 mr-2" /> MCQ Generator
          </TabsTrigger>
          <TabsTrigger value="exam" className="data-[state=active]:glass-nav-active data-[state=active]:text-violet-900 rounded-xl flex-1 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all">
            <BookOpen className="w-4 h-4 mr-2" /> Exam Prep
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="data-[state=active]:glass-nav-active data-[state=active]:text-violet-900 rounded-xl flex-1 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all">
            <Network className="w-4 h-4 mr-2" /> Mind Map
          </TabsTrigger>
        </TabsList>

        {/* AI TUTOR TAB */}
        <TabsContent value="tutor">
          <div className={cn("grid gap-6", uploadedFileName ? "md:grid-cols-4" : "md:grid-cols-1")}>
            {/* NotebookLM Style Sources Panel */}
            {uploadedFileName && (
              <div className="glass-card h-[600px] flex flex-col md:col-span-1 border-none">
                <div className="p-4 border-b border-violet-100">
                  <h3 className="font-bold flex items-center gap-2" style={{ color: "#2d2b55" }}>
                    <FileText className="w-4 h-4 text-violet-500" /> Sources
                  </h3>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-xl flex items-start gap-3 backdrop-blur-sm transition-all hover:bg-violet-50 hover:shadow-sm">
                    <div className="mt-1"><FileText className="w-5 h-5 text-violet-600" /></div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate" style={{ color: "#2d2b55" }} title={uploadedFileName}>{uploadedFileName}</p>
                      <p className="text-xs mt-1" style={{ color: "#7c6fa0" }}>Processed • Ready</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Side */}
            <div className={cn("glass-card overflow-hidden h-[600px] flex flex-col border-none", uploadedFileName ? "md:col-span-3" : "")}>
              <div className="p-4 flex justify-between items-center border-b border-violet-100/50" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div>
                  <h3 className="font-bold flex items-center gap-2" style={{ color: "#2d2b55" }}><Bot className="w-5 h-5 text-violet-500"/> Concept Explainer</h3>
                  <p className="text-sm" style={{ color: "#7c6fa0" }}>Ask anything about your uploaded materials</p>
                </div>
              </div>
            
              <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ background: "rgba(255,255,255,0.15)" }}>
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", 
                      msg.role === 'user' ? "bg-violet-100 text-violet-700 border border-violet-200" : "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                    )}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={cn("px-5 py-4 rounded-3xl max-w-[80%] text-sm shadow-sm overflow-x-auto",
                      msg.role === 'user' 
                        ? "bg-violet-600 text-white rounded-tr-none border border-violet-500" 
                        : "glass-card rounded-tl-none border border-white/60"
                    )}>
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-4" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2 mt-3" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-4 flex-row">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="px-5 py-4 rounded-3xl max-w-[80%] whitespace-pre-wrap text-sm shadow-sm glass-card border border-white/60 rounded-tl-none flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-violet-100/50" style={{ background: "rgba(255,255,255,0.3)" }}>
                <div className="flex gap-3 relative">
                  <input 
                    placeholder="E.g., Explain OS Deadlock from my notes..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="glass-input w-full pr-14 h-14 rounded-2xl text-sm px-5"
                    disabled={isChatLoading}
                  />
                  <button className="glass-btn absolute right-2 top-2 h-10 w-10 rounded-xl flex items-center justify-center" onClick={handleSendMessage} disabled={isChatLoading}>
                    {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* FLASHCARDS TAB */}
        <TabsContent value="flashcards">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="glass-card md:col-span-1 border-none h-fit p-5">
              <div className="pb-4 border-b border-violet-100/50 mb-4">
                <h3 className="text-lg font-bold text-violet-900">Generate Set</h3>
                <p className="text-sm" style={{ color: "#7c6fa0" }}>Create flashcards from notes</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold" style={{ color: "#2d2b55" }}>Source Document</label>
                  <div className="flex h-11 w-full items-center rounded-xl glass-input px-4 text-sm font-medium" style={{ color: "#7c6fa0" }}>
                    {uploadedFileName || "Upload a PDF first"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold" style={{ color: "#2d2b55" }}>Specific Topic (Optional)</label>
                  <input placeholder="e.g. Deadlock Avoidance" value={flashcardTopic} onChange={e => setFlashcardTopic(e.target.value)} className="glass-input w-full h-11 rounded-xl px-4 text-sm" />
                </div>
                <button className="glass-btn w-full h-12 rounded-xl flex items-center justify-center" onClick={handleGenerateFlashcards} disabled={isGeneratingFlashcards}>
                  {isGeneratingFlashcards ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <BrainCircuit className="w-5 h-5 mr-2" />} 
                  {isGeneratingFlashcards ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col items-center justify-center min-h-[500px]">
              {flashcards.length === 0 ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-5" style={{ background: "rgba(124,58,237,0.1)" }}>
                    <BrainCircuit className="w-10 h-10 text-violet-400" />
                  </div>
                  <p className="text-lg font-semibold" style={{ color: "#2d2b55" }}>Enter a topic and generate flashcards to start studying!</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex justify-between w-full max-w-2xl items-center px-4">
                    <div className="badge-lavender text-sm px-3 py-1">Generated Flashcards</div>
                    <span className="text-sm font-bold" style={{ color: "#7c6fa0" }}>Card {activeCard + 1} of {flashcards.length}</span>
                  </div>
                  
                  {/* Flip Card Container */}
                  <div className="relative w-full max-w-2xl h-80 perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={cn("w-full h-full transition-all duration-500 preserve-3d relative", isFlipped ? "rotate-y-180" : "")}>
                      
                      {/* Front (Question) */}
                      <div className="absolute w-full h-full backface-hidden glass-card rounded-3xl p-10 flex flex-col items-center justify-center text-center border-none">
                        <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)" }}>
                          <FileText className="w-6 h-6 text-violet-500" />
                        </div>
                        <h2 className="text-3xl font-black leading-tight" style={{ color: "#2d2b55" }}>
                          {flashcards[activeCard]?.q}
                        </h2>
                        <p className="absolute bottom-6 text-sm font-medium flex items-center gap-2" style={{ color: "#7c6fa0" }}>
                          <RotateCcw className="w-4 h-4" /> Click to reveal answer
                        </p>
                      </div>

                      {/* Back (Answer) */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center text-center text-white overflow-y-auto border border-violet-400/30">
                        <h3 className="text-xl font-semibold leading-relaxed">
                          {flashcards[activeCard]?.a}
                        </h3>
                      </div>

                    </div>
                  </div>

                  <div className="mt-12 flex gap-4">
                    <button className="glass-btn px-8 h-12 rounded-2xl" style={{ background: "rgba(255,255,255,0.4)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.2)" }} onClick={() => setActiveCard(activeCard === 0 ? flashcards.length - 1 : activeCard - 1)}>
                      Previous
                    </button>
                    <button className="glass-btn px-10 h-12 rounded-2xl flex items-center" onClick={handleNextCard}>
                      Next Card <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* MCQ GENERATOR TAB */}
        <TabsContent value="mcq">
          <div className="glass-card border-none shadow-md overflow-hidden">
            <div className="p-6 border-b border-violet-100/50" style={{ background: "rgba(255,255,255,0.2)" }}>
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "#2d2b55" }}><CheckCircle2 className="w-6 h-6 text-violet-500"/> Test Your Knowledge</h3>
              <p className="text-sm mt-1" style={{ color: "#7c6fa0" }}>Dynamically generated quizzes from your notes</p>
            </div>
            <div className="p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                
                {mcqs.length === 0 ? (
                  <div className="text-center space-y-6 py-10">
                    <div className="w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)" }}>
                      <CheckCircle2 className="w-12 h-12 text-violet-400" />
                    </div>
                    <h2 className="text-2xl font-black" style={{ color: "#2d2b55" }}>Ready to test yourself?</h2>
                    <div className="flex gap-3 max-w-lg mx-auto relative">
                      <input placeholder="Enter a topic to generate MCQs..." className="glass-input w-full h-14 rounded-2xl px-5 text-sm pr-32" value={mcqTopic} onChange={e => setMcqTopic(e.target.value)} />
                      <button className="glass-btn absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-xl text-sm" onClick={handleGenerateMCQs} disabled={isGeneratingMCQs}>
                        {isGeneratingMCQs ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-3 mb-10">
                      <div className="badge-lavender text-sm px-4 py-1.5 inline-block mb-2">Question {currentMcqIndex + 1} of {mcqs.length}</div>
                      <h2 className="text-2xl font-black leading-snug" style={{ color: "#2d2b55" }}>{mcqs[currentMcqIndex]?.q}</h2>
                    </div>

                    <div className="grid gap-4">
                      {mcqs[currentMcqIndex]?.options.map((opt, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedMcqOption(i)}
                          className={cn("flex items-center p-5 rounded-2xl cursor-pointer transition-all border group", 
                            selectedMcqOption === i ? "glass-nav-active border-violet-400" : "glass-card border-transparent hover:border-violet-200"
                          )}>
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mr-5 font-bold transition-colors",
                            selectedMcqOption === i ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-600 group-hover:bg-violet-200"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className={cn("text-lg font-semibold", selectedMcqOption === i ? "text-violet-900" : "text-slate-700 group-hover:text-violet-800")}>{opt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-8 mt-8 border-t border-violet-100">
                      <button className="glass-btn px-6 py-3 rounded-xl bg-white/40 text-violet-700 border-violet-200" onClick={() => setMcqs([])}>New Topic</button>
                      <button 
                        className="glass-btn px-8 py-3 rounded-xl" 
                        onClick={() => {
                          if (selectedMcqOption === null) return alert("Select an option first");
                          const isCorrect = mcqs[currentMcqIndex].options[selectedMcqOption] === mcqs[currentMcqIndex].correctAnswer;
                          alert(isCorrect ? "Correct!" : `Incorrect. The correct answer was: ${mcqs[currentMcqIndex].correctAnswer}`);
                          if (currentMcqIndex < mcqs.length - 1) {
                            setCurrentMcqIndex(curr => curr + 1);
                            setSelectedMcqOption(null);
                          }
                        }}
                      >
                        {currentMcqIndex < mcqs.length - 1 ? "Submit & Next" : "Finish"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* EXAM PREP TAB */}
        <TabsContent value="exam">
          <div className="glass-card border-none shadow-lg bg-gradient-to-br overflow-hidden relative" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(167,139,250,0.05) 100%)" }}>
            <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-1/4 translate-y-1/4 pointer-events-none">
              <BookOpen className="w-80 h-80 text-violet-900" />
            </div>
            <div className="p-8 border-b border-violet-200/40 relative z-10">
              <h3 className="text-2xl font-black flex items-center gap-2" style={{ color: "#2d2b55" }}>
                <PenTool className="w-6 h-6 text-violet-600"/> Generate Revision Notes
              </h3>
              <p className="mt-1 font-medium" style={{ color: "#7c6fa0" }}>Condense entire chapters into high-yield summaries.</p>
            </div>
            <div className="p-8 space-y-6 relative z-10 max-w-4xl mx-auto">
              {!examNotes ? (
                <div className="glass-card p-8 rounded-3xl space-y-5 border-white/60">
                  <div className="space-y-2">
                    <label className="text-sm font-bold" style={{ color: "#2d2b55" }}>Source Document</label>
                    <div className="flex h-14 w-full items-center rounded-2xl glass-input px-5 text-sm font-semibold" style={{ color: "#7c6fa0" }}>
                      {uploadedFileName || "Upload a PDF first"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold" style={{ color: "#2d2b55" }}>Specific Focus (Optional)</label>
                    <input placeholder="e.g. Unit 4, Concurrency Control" value={examTopic} onChange={e => setExamTopic(e.target.value)} className="h-14 glass-input rounded-2xl w-full px-5 text-sm" />
                  </div>
                  <button className="glass-btn w-full h-14 text-lg rounded-2xl mt-4 flex items-center justify-center" onClick={handleGenerateNotes} disabled={isGeneratingNotes}>
                    {isGeneratingNotes ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <PenTool className="w-5 h-5 mr-2" />} 
                    {isGeneratingNotes ? "Generating Notes..." : "Generate Study Guide"}
                  </button>
                </div>
              ) : (
                <div className="glass-card p-8 rounded-3xl h-[500px] overflow-y-auto text-sm border border-white/60">
                  <div className="flex justify-end mb-6 sticky top-0 bg-white/40 backdrop-blur-md p-2 rounded-xl border border-white/50 -mx-2 -mt-2">
                    <button className="glass-btn px-4 py-2 rounded-xl text-sm flex items-center bg-white/60 text-violet-700 border-violet-200" onClick={() => setExamNotes("")}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                    </button>
                  </div>
                  <div className="prose prose-violet max-w-none" style={{ color: "#2d2b55" }}>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-base font-medium" style={{ color: "#4b467a" }} {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-5 space-y-2 text-base font-medium" style={{ color: "#4b467a" }} {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-base font-medium" style={{ color: "#4b467a" }} {...props} />,
                        strong: ({node, ...props}) => <strong className="font-extrabold" style={{ color: "#2d2b55" }} {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-3xl font-black mb-6 mt-8 pb-2 border-b border-violet-200/50" style={{ color: "#2d2b55" }} {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: "#2d2b55" }} {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-3 mt-6 text-violet-800" {...props} />,
                      }}
                    >
                      {examNotes}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* MIND MAP TAB */}
        <TabsContent value="mindmap">
          <div className="glass-card border-none shadow-lg overflow-hidden">
            <div className="p-6 border-b border-violet-100/50" style={{ background: "rgba(255,255,255,0.2)" }}>
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "#2d2b55" }}><Network className="w-6 h-6 text-violet-500"/> Visual Mind Maps</h3>
              <p className="mt-1 text-sm font-medium" style={{ color: "#7c6fa0" }}>Generate structured mind maps to visualize complex relationships</p>
            </div>
            <div className="p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="glass-card p-6 rounded-3xl space-y-4 border-white/60">
                  <div className="space-y-2">
                    <label className="text-sm font-bold" style={{ color: "#2d2b55" }}>Source Document</label>
                    <div className="flex h-12 w-full items-center rounded-2xl glass-input px-4 text-sm font-medium" style={{ color: "#7c6fa0" }}>
                      {uploadedFileName || "Upload a PDF first"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold" style={{ color: "#2d2b55" }}>Core Topic</label>
                    <input placeholder="e.g. OSI Model Layers" value={mindMapTopic} onChange={e => setMindMapTopic(e.target.value)} className="glass-input h-12 rounded-2xl w-full px-4 text-sm" />
                  </div>
                  <button className="glass-btn w-full h-12 rounded-2xl text-base flex items-center justify-center mt-2" onClick={handleGenerateMindMap} disabled={isGeneratingMindMap}>
                    {isGeneratingMindMap ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Network className="w-5 h-5 mr-2" />} 
                    {isGeneratingMindMap ? "Generating Mind Map..." : "Generate Mind Map"}
                  </button>
                </div>
                
                {mindMapData ? (
                  <div className="glass-card rounded-3xl p-8 border-white/60 overflow-x-auto">
                    <div className="flex justify-between items-center mb-8 border-b border-violet-100 pb-4">
                      <h3 className="text-2xl font-black" style={{ color: "#2d2b55" }}>{mindMapData.name || mindMapTopic}</h3>
                      <button className="glass-btn px-4 py-2 rounded-xl text-sm flex items-center bg-white/40 text-violet-700 border-violet-200" onClick={() => setMindMapData(null)}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset
                      </button>
                    </div>
                    <ul className="space-y-6 text-sm font-medium">
                      {(mindMapData.children || []).map((child: any, i: number) => (
                        <li key={i} className="pl-6 border-l-2 border-violet-400 relative">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-violet-100 border-2 border-violet-500" />
                          <span className="font-bold text-lg block mb-3" style={{ color: "#2d2b55" }}>{child.name}</span>
                          <ul className="space-y-3 mt-2 bg-white/30 p-4 rounded-2xl border border-violet-100/50">
                            {(child.children || []).map((subChild: any, j: number) => (
                              <li key={j} className="pl-6 relative before:content-[''] before:absolute before:w-4 before:h-px before:bg-violet-300 before:-left-0 before:top-2.5 font-semibold" style={{ color: "#5b4f8a" }}>
                                {subChild.name || subChild}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-violet-200/50">
                    <div className="w-20 h-20 rounded-3xl bg-violet-100 text-violet-600 flex items-center justify-center mb-5 border border-violet-200">
                      <Network className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black mb-2" style={{ color: "#2d2b55" }}>Ready to Map</h3>
                    <p className="font-medium max-w-md" style={{ color: "#7c6fa0" }}>
                      Select a topic and generate a mind map. The AI will extract key concepts and their relationships from your uploaded notes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
