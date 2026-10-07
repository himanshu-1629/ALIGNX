import { Router } from 'express';
import { generateRoadmap, getRoadmap } from '../controllers/skillsRoadmapController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Generation
router.post('/generate/:careerSlug', authenticate, generateRoadmap);
router.post('/:studentId/:careerId', generateRoadmap);

// Retrieval
router.get('/detail/:roadmapId', getRoadmap);
router.get('/:studentId/:careerId', getRoadmap);
router.get('/:careerSlug', authenticate, getRoadmap);

export default router;
