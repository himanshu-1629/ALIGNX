import { Router } from 'express';
import { runSimulator, getSimulationHistory } from '../controllers/simulatorController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Run simulation
router.post('/run', authenticate, runSimulator);
router.post('/:studentId', runSimulator);

// History
router.get('/history', authenticate, getSimulationHistory);
router.get('/:studentId', getSimulationHistory);

export default router;
