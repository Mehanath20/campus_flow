import { Request, Response } from 'express';
import { ProductivityService } from '../services/productivity.service';

export class ProductivityController {
  static async planDeadline(req: Request, res: Response) {
    try {
      const { assignmentTitle, daysUntilDue, difficulty } = req.body;
      const plan = await ProductivityService.planDeadline(assignmentTitle, daysUntilDue, difficulty);
      res.status(200).json({ plan });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async processNotice(req: Request, res: Response) {
    try {
      const { noticeText } = req.body;
      const intelligence = await ProductivityService.processNotice(noticeText);
      res.status(200).json({ intelligence });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkAttendanceRisk(req: Request, res: Response) {
    try {
      const { classesAttended, totalClassesConducted, requiredPercentage } = req.body;
      const riskAnalysis = ProductivityService.calculateAttendanceRisk(
        Number(classesAttended),
        Number(totalClassesConducted),
        Number(requiredPercentage) || 75
      );
      res.status(200).json({ riskAnalysis });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async generateStudyPlan(req: Request, res: Response) {
    try {
      const { subjects, exams, availableHoursPerDay } = req.body;
      const studyPlan = await ProductivityService.generateStudyPlan(subjects, exams, availableHoursPerDay);
      res.status(200).json({ studyPlan });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
