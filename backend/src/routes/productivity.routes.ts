import { Router } from 'express';
import { ProductivityController } from '../controllers/productivity.controller';

const router = Router();

router.post('/deadline', ProductivityController.planDeadline);
router.post('/notice', ProductivityController.processNotice);
router.post('/attendance', ProductivityController.checkAttendanceRisk);
router.post('/study-plan', ProductivityController.generateStudyPlan);

export default router;
