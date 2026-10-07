import { Router } from 'express';
import { getStudentDashboard } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getStudentDashboard);
router.get('/:studentId', getStudentDashboard);

export default router;
