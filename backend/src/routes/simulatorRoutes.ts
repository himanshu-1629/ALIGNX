import { Router } from 'express';
import { runSimulator, getSimulationHistory } from '../controllers/simulatorController';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Run simulation
router.post('/run', optionalAuthenticate, runSimulator);
router.post('/:studentId', optionalAuthenticate, runSimulator);

// History
router.get('/history', optionalAuthenticate, getSimulationHistory);
router.get('/:studentId', optionalAuthenticate, getSimulationHistory);

export default router;
