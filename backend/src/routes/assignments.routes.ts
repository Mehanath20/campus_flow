import { Router } from 'express';
import { createAssignment } from '../controllers/assignments.controller';

const router = Router();

router.post('/', createAssignment);

export default router;
