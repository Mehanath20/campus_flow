import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY || "placeholder",
  temperature: 0.2,
});

export class ProductivityService {
  // 3.1 Smart Deadline Manager
  static async planDeadline(assignmentTitle: string, daysUntilDue: number, difficulty: string) {
    const prompt = `You are a productivity expert for college students. 
A student has an assignment titled "${assignmentTitle}" due in ${daysUntilDue} days. The difficulty is ${difficulty}.
Break this down into a day-by-day actionable task plan. 
Return ONLY a JSON array of objects, where each object has:
- "day": (number)
- "title": (string)
- "description": (string)
- "estimatedHours": (number)
`;
    
    const response = await llm.invoke(prompt);
    try {
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Failed to generate deadline plan.");
    }
  }

  // 3.2 Notice Intelligence System
  static async processNotice(noticeText: string) {
    const prompt = `Extract key information from the following college notice and turn it into actionable items.
Return ONLY a JSON object with the following structure:
{
  "summary": "1-2 sentence summary",
  "events": [{"title": "Event Name", "date": "Date/Time", "venue": "Venue"}],
  "deadlines": [{"title": "Deadline Name", "date": "Date"}],
  "actionItems": ["Action 1", "Action 2"],
  "importantDates": ["Date 1", "Date 2"]
}

Notice Text:
${noticeText}`;

    const response = await llm.invoke(prompt);
    try {
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Failed to process notice.");
    }
  }

  // 3.3 Attendance Risk Predictor
  static calculateAttendanceRisk(classesAttended: number, totalClassesConducted: number, requiredPercentage = 75) {
    const currentPercentage = totalClassesConducted === 0 ? 100 : (classesAttended / totalClassesConducted) * 100;
    
    let riskLevel = "Safe";
    let message = "You are maintaining good attendance.";
    let classesToAttendToBecomeSafe = 0;
    let classesCanMiss = 0;

    if (currentPercentage < requiredPercentage) {
      riskLevel = currentPercentage < (requiredPercentage - 10) ? "Critical" : "Warning";
      
      // Calculate how many consecutive classes needed to hit target percentage
      // (attended + x) / (total + x) = target / 100
      // 100(attended + x) = target(total + x)
      // 100x - target*x = target*total - 100*attended
      // x = (target*total - 100*attended) / (100 - target)
      classesToAttendToBecomeSafe = Math.ceil(((requiredPercentage * totalClassesConducted) - (100 * classesAttended)) / (100 - requiredPercentage));
      
      message = `You are below the required ${requiredPercentage}%. You must attend the next ${classesToAttendToBecomeSafe} classes consecutively to be safe.`;
    } else {
      // Calculate how many can be missed
      // attended / (total + x) = target / 100
      // 100 * attended = target * total + target * x
      // x = (100 * attended - target * total) / target
      classesCanMiss = Math.floor((100 * classesAttended - requiredPercentage * totalClassesConducted) / requiredPercentage);
      message = `You are in the safe zone. You can miss ${classesCanMiss} upcoming classes.`;
    }

    return {
      currentPercentage: currentPercentage.toFixed(2),
      riskLevel,
      requiredPercentage,
      classesToAttendToBecomeSafe,
      classesCanMiss,
      message
    };
  }

  // 3.4 Study Planner
  static async generateStudyPlan(subjects: any[], exams: any[], availableHoursPerDay: number) {
    const prompt = `You are an AI study planner. Create a weekly study schedule based on the following constraints:
Subjects: ${JSON.stringify(subjects)}
Upcoming Exams: ${JSON.stringify(exams)}
Available study hours per day: ${availableHoursPerDay}

Allocate more time to difficult subjects and subjects with closer exams.
Return ONLY a JSON object representing a 7-day schedule:
{
  "Monday": [{"subject": "Subject Name", "topic": "Topic to study", "durationHours": 1.5}],
  ...
}
`;

    const response = await llm.invoke(prompt);
    try {
      const jsonStr = (response.content as string).replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Failed to generate study plan.");
    }
  }
}
