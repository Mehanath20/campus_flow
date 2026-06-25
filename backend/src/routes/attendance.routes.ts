import { Router } from 'express';
import { submitAttendance, getStudentsForAttendance, getSubjects, getStudentAttendanceByEmail } from '../controllers/attendance.controller';

const router = Router();

router.post('/mark', submitAttendance);
router.get('/students', getStudentsForAttendance);
router.get('/subjects', getSubjects);
router.get('/student-records', getStudentAttendanceByEmail);

export default router;
