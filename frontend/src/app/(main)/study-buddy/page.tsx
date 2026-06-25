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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            AI Knowledge Engine
          </h1>
          <p className="text-muted-foreground mt-1">Your personal, context-aware AI tutor powered by Gemini & RAG.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />
          <Button variant="outline" className="bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-700" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />} 
            {isUploading ? "Uploading..." : "Upload PDF"}
          </Button>
          <Badge variant="outline" className="px-3 py-1 bg-white h-10 flex items-center">Connected: 12 Documents</Badge>
          <Badge variant="secondary" className="px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 h-10 flex items-center">Gemini 2.5 Flash</Badge>
        </div>
      </div>

      <Tabs defaultValue="tutor" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14 bg-white/50 backdrop-blur border shadow-sm p-1">
          <TabsTrigger value="tutor" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md">
            <MessageSquare className="w-4 h-4 mr-2" /> AI Tutor
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md">
            <BrainCircuit className="w-4 h-4 mr-2" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="mcq" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
            <CheckCircle2 className="w-4 h-4 mr-2" /> MCQ Generator
          </TabsTrigger>
          <TabsTrigger value="exam" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md">
            <BookOpen className="w-4 h-4 mr-2" /> Exam Prep
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-md">
            <Network className="w-4 h-4 mr-2" /> Mind Map
          </TabsTrigger>
        </TabsList>

        {/* AI TUTOR TAB */}
        <TabsContent value="tutor" className="mt-6">
          <div className={cn("grid gap-6", uploadedFileName ? "md:grid-cols-4" : "md:grid-cols-1")}>
            {/* NotebookLM Style Sources Panel */}
            {uploadedFileName && (
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm h-[600px] flex flex-col md:col-span-1">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" /> Sources
                  </h3>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                    <div className="mt-1"><FileText className="w-5 h-5 text-indigo-600" /></div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-800 truncate" title={uploadedFileName}>{uploadedFileName}</p>
                      <p className="text-xs text-slate-500 mt-1">Processed • Ready</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Chat Side */}
            <Card className={cn("border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden h-[600px] flex flex-col", uploadedFileName ? "md:col-span-3" : "")}>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Bot className="w-5 h-5"/> Concept Explainer</h3>
                <p className="text-indigo-100 text-sm">Ask anything about your uploaded materials</p>
              </div>
            </div>
            
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm", 
                    msg.role === 'user' ? "bg-indigo-100 text-indigo-700" : "bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn("px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm overflow-x-auto",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white border text-slate-800 rounded-tl-none"
                  )}>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="" {...props} />,
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap text-sm shadow-sm bg-white border text-slate-800 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> Thinking...
                  </div>
                </div>
              )}
            </CardContent>
            
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2 relative">
                <Input 
                  placeholder="E.g., Explain OS Deadlock from my notes..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                  disabled={isChatLoading}
                />
                <Button size="icon" className="absolute right-1 top-1 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 rounded-lg" onClick={handleSendMessage} disabled={isChatLoading}>
                  {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
          </div>
        </TabsContent>

        {/* FLASHCARDS TAB */}
        <TabsContent value="flashcards" className="mt-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 border-0 shadow-md h-fit">
              <CardHeader className="bg-purple-50 pb-4 border-b">
                <CardTitle className="text-lg text-purple-900">Generate Set</CardTitle>
                <CardDescription>Create flashcards from notes</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Document</label>
                  <div className="flex h-10 w-full items-center rounded-md border border-input bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    {uploadedFileName || "Upload a PDF first"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specific Topic (Optional)</label>
                  <Input placeholder="e.g. Deadlock Avoidance" value={flashcardTopic} onChange={e => setFlashcardTopic(e.target.value)} />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleGenerateFlashcards} disabled={isGeneratingFlashcards}>
                  {isGeneratingFlashcards ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />} 
                  {isGeneratingFlashcards ? "Generating..." : "Generate"}
                </Button>
              </CardContent>
            </Card>

            <div className="md:col-span-3 flex flex-col items-center justify-center min-h-[500px]">
              {flashcards.length === 0 ? (
                <div className="text-center text-slate-500">
                  <BrainCircuit className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p>Enter a topic and generate flashcards to start studying!</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex justify-between w-full max-w-2xl items-center px-4">
                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">Generated Flashcards</Badge>
                    <span className="text-sm font-medium text-slate-500">Card {activeCard + 1} of {flashcards.length}</span>
                  </div>
                  
                  {/* Flip Card Container */}
                  <div className="relative w-full max-w-2xl h-80 perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={cn("w-full h-full transition-all duration-500 preserve-3d relative", isFlipped ? "rotate-y-180" : "")}>
                      
                      {/* Front (Question) */}
                      <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center text-center">
                        <div className="absolute top-6 left-6 text-slate-300"><FileText className="w-8 h-8" /></div>
                        <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                          {flashcards[activeCard]?.q}
                        </h2>
                        <p className="absolute bottom-6 text-sm text-slate-400 flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" /> Click to reveal answer
                        </p>
                      </div>

                      {/* Back (Answer) */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center text-center text-white overflow-y-auto">
                        <h3 className="text-xl font-medium leading-relaxed">
                          {flashcards[activeCard]?.a}
                        </h3>
                      </div>

                    </div>
                  </div>

                  <div className="mt-12 flex gap-4">
                    <Button variant="outline" className="h-12 px-6" onClick={() => setActiveCard(activeCard === 0 ? flashcards.length - 1 : activeCard - 1)}>
                      Previous
                    </Button>
                    <Button className="h-12 px-8 bg-purple-600 hover:bg-purple-700 text-lg shadow-md" onClick={handleNextCard}>
                      Next Card <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* MCQ GENERATOR TAB */}
        <TabsContent value="mcq" className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-blue-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Test Your Knowledge</CardTitle>
              <CardDescription>Dynamically generated quizzes from your notes</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                
                {mcqs.length === 0 ? (
                  <div className="text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-blue-200" />
                    <h2 className="text-xl font-medium text-slate-700">Ready to test yourself?</h2>
                    <div className="flex gap-2 max-w-md mx-auto">
                      <Input placeholder="Enter a topic to generate MCQs..." value={mcqTopic} onChange={e => setMcqTopic(e.target.value)} />
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGenerateMCQs} disabled={isGeneratingMCQs}>
                        {isGeneratingMCQs ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center space-y-2 mb-10">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none mb-2">Question {currentMcqIndex + 1} of {mcqs.length}</Badge>
                      <h2 className="text-2xl font-semibold text-slate-800">{mcqs[currentMcqIndex]?.q}</h2>
                    </div>

                    <div className="grid gap-4">
                      {mcqs[currentMcqIndex]?.options.map((opt, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedMcqOption(i)}
                          className={cn("flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors group", 
                            selectedMcqOption === i ? "border-blue-500 bg-blue-50" : "hover:border-blue-400 hover:bg-blue-50"
                          )}>
                          <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-medium",
                            selectedMcqOption === i ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-500 group-hover:border-blue-500 group-hover:text-blue-600"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className={cn("text-lg font-medium", selectedMcqOption === i ? "text-blue-900" : "text-slate-700 group-hover:text-blue-900")}>{opt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t">
                      <Button variant="outline" onClick={() => setMcqs([])}>New Topic</Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 px-8" 
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
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXAM PREP TAB */}
        <TabsContent value="exam" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={cn("border-0 shadow-md bg-gradient-to-br text-white overflow-hidden relative", examNotes ? "md:col-span-2 from-emerald-600 to-teal-800" : "from-emerald-500 to-teal-600")}>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
                <BookOpen className="w-64 h-64" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Generate Revision Notes</CardTitle>
                <CardDescription className="text-emerald-50">Condense entire chapters into high-yield summaries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {!examNotes ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Source Document</label>
                      <div className="flex h-12 w-full items-center rounded-md border-0 bg-white/20 px-3 py-2 text-sm text-white">
                        {uploadedFileName || "Upload a PDF first"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Specific Focus (Optional)</label>
                      <Input placeholder="e.g. Unit 4, Concurrency Control" value={examTopic} onChange={e => setExamTopic(e.target.value)} className="h-12 bg-white/20 border-0 placeholder:text-emerald-100 text-white focus-visible:ring-white" />
                    </div>
                    <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 h-12 text-lg font-bold shadow-lg mt-4" onClick={handleGenerateNotes} disabled={isGeneratingNotes}>
                      {isGeneratingNotes ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <PenTool className="w-5 h-5 mr-2" />} 
                      {isGeneratingNotes ? "Generating Notes..." : "Generate Study Guide"}
                    </Button>
                  </>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-emerald-50 h-[400px] overflow-y-auto text-sm border border-white/20">
                    <div className="flex justify-end mb-4">
                      <Button variant="ghost" size="sm" onClick={() => setExamNotes("")} className="text-white hover:bg-white/20">
                        <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                      </Button>
                    </div>
                    <div className="prose-emerald">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                          li: ({node, ...props}) => <li className="" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5 text-white" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4 text-white" {...props} />,
                        }}
                      >
                        {examNotes}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* We removed the hardcoded Predictor Card as per user request */}
          </div>
        </TabsContent>

        {/* MIND MAP TAB */}
        <TabsContent value="mindmap" className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="text-orange-900 flex items-center gap-2"><Network className="w-5 h-5"/> Visual Mind Maps</CardTitle>
              <CardDescription>Generate structured mind maps to visualize complex relationships</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source Document</label>
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      {uploadedFileName || "Upload a PDF first"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Core Topic</label>
                    <Input placeholder="e.g. OSI Model Layers" value={mindMapTopic} onChange={e => setMindMapTopic(e.target.value)} />
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg" onClick={handleGenerateMindMap} disabled={isGeneratingMindMap}>
                    {isGeneratingMindMap ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Network className="w-5 h-5 mr-2" />} 
                    {isGeneratingMindMap ? "Generating Mind Map..." : "Generate Mind Map"}
                  </Button>
                </div>
                
                {mindMapData ? (
                  <div className="mt-8 border border-orange-200 rounded-xl p-6 bg-white shadow-inner overflow-x-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">{mindMapData.name || mindMapTopic}</h3>
                      <Button variant="ghost" size="sm" onClick={() => setMindMapData(null)}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
                    </div>
                    <ul className="space-y-4 text-sm font-medium text-slate-700">
                      {(mindMapData.children || []).map((child: any, i: number) => (
                        <li key={i} className="pl-6 border-l-2 border-orange-400">
                          <span className="text-orange-700 font-bold text-base block mb-2">{child.name}</span>
                          <ul className="space-y-2 mt-1">
                            {(child.children || []).map((subChild: any, j: number) => (
                              <li key={j} className="pl-6 border-l border-slate-300 relative before:content-[''] before:absolute before:w-4 before:h-px before:bg-slate-300 before:-left-0 before:top-2.5 text-slate-600 font-normal">
                                {subChild.name || subChild}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-8 border-2 border-dashed border-orange-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-orange-50/50">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                      <Network className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to Map</h3>
                    <p className="text-slate-500 max-w-md">
                      Select a topic and generate a mind map. The AI will extract key concepts and their relationships from your uploaded notes.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
