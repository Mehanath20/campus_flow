import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const pdfParse = require("pdf-parse");
import { AutomationService } from "./automation.service";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY || "placeholder",
  temperature: 0.2,
});

export class InnovationService {
  // 5.1 Placement Intelligence
  static async generateInterviewPrep(company: string, role: string) {
    const prompt = `Act as an expert technical recruiter. Generate a preparation roadmap, resume tips, and 5 likely interview questions for a student applying for the "${role}" role at "${company}".
Return ONLY a JSON object:
{
  "roadmap": ["Step 1", "Step 2"],
  "resumeTips": ["Tip 1", "Tip 2"],
  "questions": ["Q1", "Q2"]
}`;
    const response = await llm.invoke(prompt);
    try {
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Failed to generate placement prep.");
    }
  }

  // 5.2 AI Resume Analyzer
  static async analyzeResume(fileBuffer: Buffer, targetRole: string) {
    const data = await pdfParse(fileBuffer);
    const resumeText = data.text;

    const prompt = `You are an ATS (Applicant Tracking System) and expert technical recruiter. Analyze the following resume for the target role: "${targetRole}".
Return ONLY a JSON object:
{
  "atsScore": (number 1-100),
  "skillsGap": ["Missing Skill 1", "Missing Skill 2"],
  "missingKeywords": ["Keyword 1", "Keyword 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}

Resume Text:
${resumeText.substring(0, 5000)}`; // limit token length just in case

    const response = await llm.invoke(prompt);
    try {
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Failed to analyze resume.");
    }
  }

  // 5.3 Study Group Matcher
  static async matchStudyGroup(studentId: string, subject: string, topic: string) {
    // In a real app, query DB for students with similar subjects, overlapping availability, and complementary performance.
    const mockMatchedStudents = [
      { name: "Rahul S.", phone: "+1234567890", skillLevel: "Expert" },
      { name: "Priya M.", phone: "+0987654321", skillLevel: "Intermediate" }
    ];

    // Auto Create Calendar Event (Mock)
    await AutomationService.createCalendarEvent({}, {
      summary: `Study Group: ${subject} - ${topic}`,
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 3600000).toISOString()
    });

    // Auto Send WhatsApp Invites (Mock)
    for (const student of mockMatchedStudents) {
      await AutomationService.sendWhatsAppMessage(
        student.phone, 
        `📚 You've been matched! Join the upcoming study group for ${subject} (${topic}). Check your calendar!`
      );
    }

    return {
      groupCreated: true,
      matchedStudents: mockMatchedStudents.map(s => s.name),
      message: "Study group matched, calendar events created, and WhatsApp invites sent."
    };
  }

  // 5.4 & 5.5 Predictive AI & Analytics
  static calculatePredictiveAnalytics(studentData: any) {
    // Advanced math/ML model mocked
    const productivityScore = 85;
    const attendanceScore = 92;
    const learningScore = 78;
    const placementReadiness = 65;

    return {
      scores: {
        productivity: productivityScore,
        attendance: attendanceScore,
        learning: learningScore,
        placement: placementReadiness
      },
      predictions: {
        missedDeadlinesRisk: "Low",
        attendanceRisk: "Safe",
        examPerformancePrediction: "A Grade (85-90%)",
        placementPrediction: "Needs to improve Data Structures before applying to Tier 1."
      }
    };
  }
}
