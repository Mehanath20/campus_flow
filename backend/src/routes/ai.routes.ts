import { Router } from 'express';
import multer from 'multer';
import { AIController } from '../controllers/ai.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('document'), AIController.uploadDocument);
router.post('/tutor', AIController.tutorChat);
router.post('/study-material', AIController.generateStudyMaterial);

export default router;
