import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export class AIController {
  static async uploadDocument(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // In a real app, userId comes from JWT
      const userId = 'placeholder-user-id'; 
      const subjectId = req.body.subjectId;

      const doc = await AIService.processDocument(req.file.buffer, req.file.originalname, userId, subjectId);
      res.status(200).json({ message: 'Document processed successfully', document: doc });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async tutorChat(req: Request, res: Response) {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: 'Query is required' });

      const answer = await AIService.aiTutorChat(query);
      res.status(200).json({ answer });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async generateStudyMaterial(req: Request, res: Response) {
    try {
      const { topic, type } = req.body; // type: 'flashcards', 'mcq', 'notes'
      if (!topic || !type) return res.status(400).json({ error: 'Topic and type are required' });

      let result;
      if (type === 'flashcards') {
        result = await AIService.generateFlashcards(topic);
      } else if (type === 'mcq') {
        result = await AIService.generateMCQs(topic);
      } else if (type === 'notes') {
        result = await AIService.generateRevisionNotes(topic);
      } else if (type === 'mindmap') {
        result = await AIService.generateMindMap(topic);
      } else if (type === 'placement') {
        const { category } = req.body;
        result = await AIService.generatePlacementPrep(category || 'General', topic);
      } else {
        return res.status(400).json({ error: 'Invalid type' });
      }

      res.status(200).json({ result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
