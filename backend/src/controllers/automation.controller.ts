import { Request, Response } from 'express';
import { AutomationService } from '../services/automation.service';

export class AutomationController {
  static async triggerDeadlineWorkflow(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await AutomationService.handleDeadlineWebhook(data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async triggerAttendanceWarning(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await AutomationService.handleAttendanceWarning(data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendCustomWhatsApp(req: Request, res: Response) {
    try {
      const { phone, message } = req.body;
      const result = await AutomationService.sendWhatsAppMessage(phone, message);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
