import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
const pdfParse = require("pdf-parse");

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("GOOGLE_API_KEY is not set in the .env file.");
}

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: apiKey,
});

const llm = new ChatOpenAI({
  modelName: "openrouter/auto",
  apiKey: "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",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.2,
});

// Use an in-memory vector store to make RAG work immediately without needing Supabase setup
let vectorStore: MemoryVectorStore | null = null;

export class AIService {
  // 2.1 RAG Processing Pipeline
  static async processDocument(fileBuffer: Buffer, fileName: string, userId: string, subjectId?: string) {
    // 1. Extract Text
    const data = await pdfParse(fileBuffer);
    const text = data.text;

    // 2. Chunking
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([text]);

    // 3. Embedding and 4. Vector DB Store
    // Using in-memory vector store to make it work
    if (!vectorStore) {
      vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
    } else {
      await vectorStore.addDocuments(chunks);
    }

    return { id: Math.random().toString(), title: fileName, file_type: 'pdf' };
  }

  // Helper for Retrieval
  static async retrieveContext(query: string, limit = 5): Promise<string> {
    if (!vectorStore) return "No relevant context found. Please upload a PDF first.";
    
    const results = await vectorStore.similaritySearch(query, limit);
    if (!results || results.length === 0) return "No relevant context found.";

    return results.map((r: any) => r.pageContent).join("\n\n");
  }

  // 2.3 AI Tutor
  static async aiTutorChat(query: string) {
    const context = await this.retrieveContext(query);
    
    const prompt = `You are a helpful AI Tutor. Answer the student's question based strictly on the provided context from their uploaded notes.
If the context doesn't contain the answer, say you don't know based on the uploaded notes.

Context:
${context}

Student Question: ${query}

Answer:`;

    const response = await llm.invoke(prompt);
    return response.content;
  }

  // 2.2 AI Study Buddy - Flashcards
  static async generateFlashcards(topic: string) {
    const context = await this.retrieveContext(topic);
    
    const prompt = `Generate 5 flashcards for the topic: "${topic}" based on the following context.
Return ONLY a JSON array of objects with "question" and "answer" properties.

Context:
${context}`;

    const response = await llm.invoke(prompt);
    try {
      // Clean up markdown block if present
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      return [{ question: "Failed to generate", answer: "Error parsing response" }];
    }
  }

  // 2.2 AI Study Buddy - MCQs
  static async generateMCQs(topic: string) {
    const context = await this.retrieveContext(topic);
    
    const prompt = `Generate 3 Multiple Choice Questions for the topic: "${topic}" based on the following context.
Return ONLY a JSON array of objects with "question", "options" (array of 4 strings), and "correctAnswer" (string) properties.

Context:
${context}`;

    const response = await llm.invoke(prompt);
    try {
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      return [];
    }
  }

  // 2.2 AI Study Buddy - Exam Prep (Revision Notes)
  static async generateRevisionNotes(topic: string) {
    const context = await this.retrieveContext(topic);
    
    const prompt = `Create concise revision notes for the topic: "${topic}" based on the following context. Use bullet points and highlight key terms.

Context:
${context}`;

    const response = await llm.invoke(prompt);
    return response.content;
  }
  // 2.2 AI Study Buddy - Mind Map
  static async generateMindMap(topic: string) {
    const context = await this.retrieveContext(topic);
    
    const prompt = `Generate a mind map structure for the topic: "${topic}" based on the following context.
Return ONLY a JSON object representing the mind map. The root node should have a "name" property (the topic) and a "children" array of subtopics. Each subtopic can also have a "name" and "children" array, up to 3 levels deep.

Context:
${context}`;

    const response = await llm.invoke(prompt);
    try {
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      return { name: topic, children: [] };
    }
  }

  // 2.4 Placement Prep AI
  static async generatePlacementPrep(category: string, topic: string) {
    const prompt = `You are an expert Placement Preparation AI. The student is preparing for interviews (TCS, Infosys, FAANG, etc.).
Generate a comprehensive preparation guide for the category: "${category}" focusing on the topic: "${topic}".
Include:
1. Core concepts to remember.
2. Top 3 most frequently asked interview questions with detailed solutions/explanations.
3. Common pitfalls/mistakes to avoid.

Use clear Markdown formatting with headers (##), bold text (**), and code blocks if applicable.`;

    const response = await llm.invoke(prompt);
    return response.content;
  }
}
