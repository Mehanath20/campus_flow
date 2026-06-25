"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, File, Book, FileArchive, UploadCloud, Search, MoreVertical, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { id: "all", label: "All Documents", icon: Book },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "pdfs", label: "PDFs", icon: File },
  { id: "ppts", label: "Presentations", icon: File },
  { id: "manuals", label: "Lab Manuals", icon: Book },
  { id: "papers", label: "Question Papers", icon: FileArchive },
  { id: "assignments", label: "Assignments", icon: FileText },
];

const mockDocuments = [
  { id: 1, title: "OS Chapter 4 Notes", subject: "Operating Systems", type: "notes", date: "2026-06-20", size: "2.4 MB" },
  { id: 2, title: "DBMS Midterm 2025", subject: "Database Management", type: "papers", date: "2026-06-15", size: "1.1 MB" },
  { id: 3, title: "Computer Networks Lab 3", subject: "Computer Networks", type: "manuals", date: "2026-06-22", size: "850 KB" },
  { id: 4, title: "Data Structures PPT", subject: "Data Structures", type: "ppts", date: "2026-06-10", size: "5.6 MB" },
  { id: 5, title: "Software Engineering Assignment 1", subject: "Software Engineering", type: "assignments", date: "2026-06-23", size: "300 KB" },
  { id: 6, title: "TOC Lecture Notes", subject: "Theory of Computation", type: "pdfs", date: "2026-06-18", size: "4.2 MB" },
];

export default function AcademicRepository() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDocs = activeCategory === "all" 
    ? mockDocuments 
    : mockDocuments.filter(doc => doc.type === activeCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Repository</h1>
          <p className="text-muted-foreground mt-1">Your personal vault for all academic materials.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="p-4 border-b bg-white flex flex-col md:flex-row gap-4 justify-between items-center">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
            <TabsList className="flex flex-wrap h-auto bg-transparent gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-200 border border-transparent rounded-full px-4 py-2"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {cat.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-9 w-full bg-white"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <div className="divide-y">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                    {doc.type === 'notes' && <FileText className="w-5 h-5" />}
                    {doc.type === 'pdfs' && <File className="w-5 h-5" />}
                    {doc.type === 'ppts' && <File className="w-5 h-5 text-orange-500" />}
                    {doc.type === 'manuals' && <Book className="w-5 h-5 text-emerald-500" />}
                    {doc.type === 'papers' && <FileArchive className="w-5 h-5 text-red-500" />}
                    {doc.type === 'assignments' && <FileText className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-indigo-600 transition-colors">{doc.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-[10px] py-0">{doc.subject}</Badge>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
                    <Download className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950">
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {filteredDocs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <File className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
                <p className="mt-1">Try uploading a new document or changing your search filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
