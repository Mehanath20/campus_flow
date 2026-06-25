import { Request, Response } from 'express';
import { InnovationService } from '../services/innovation.service';

export class InnovationController {
  static async getInterviewPrep(req: Request, res: Response) {
    try {
      const { company, role } = req.body;
      const prep = await InnovationService.generateInterviewPrep(company, role);
      res.status(200).json(prep);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async analyzeResume(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'No resume file uploaded' });
      const { targetRole } = req.body;
      const analysis = await InnovationService.analyzeResume(req.file.buffer, targetRole || 'Software Engineer');
      res.status(200).json(analysis);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async matchStudyGroup(req: Request, res: Response) {
    try {
      const { studentId, subject, topic } = req.body;
      const matchData = await InnovationService.matchStudyGroup(studentId, subject, topic);
      res.status(200).json(matchData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPredictiveAnalytics(req: Request, res: Response) {
    try {
      // In real scenario, student data comes from DB based on JWT
      const analytics = InnovationService.calculatePredictiveAnalytics({});
      res.status(200).json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
