import { Router } from 'express';
import multer from 'multer';
import { InnovationController } from '../controllers/innovation.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/placement/prep', InnovationController.getInterviewPrep);
router.post('/placement/resume', upload.single('resume'), InnovationController.analyzeResume);
router.post('/study-group/match', InnovationController.matchStudyGroup);
router.get('/analytics/predictive', InnovationController.getPredictiveAnalytics);

export default router;
