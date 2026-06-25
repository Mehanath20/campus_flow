import { Router } from 'express';
import { AutomationController } from '../controllers/automation.controller';

const router = Router();

router.post('/webhook/deadline', AutomationController.triggerDeadlineWorkflow);
router.post('/webhook/attendance', AutomationController.triggerAttendanceWarning);
router.post('/whatsapp/send', AutomationController.sendCustomWhatsApp);

export default router;
