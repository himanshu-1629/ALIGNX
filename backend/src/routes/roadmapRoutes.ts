import { Router } from 'express';
import { generateRoadmap, getRoadmap } from '../controllers/skillsRoadmapController';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Generation
router.post('/generate/:careerSlug', optionalAuthenticate, generateRoadmap);
router.post('/:studentId/:careerId', optionalAuthenticate, generateRoadmap);

// Retrieval
router.get('/detail/:roadmapId', getRoadmap);
router.get('/:studentId/:careerId', getRoadmap);
router.get('/:careerSlug', optionalAuthenticate, getRoadmap);

export default router;
