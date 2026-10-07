import { Router } from 'express';
import { getSkillGaps } from '../controllers/skillsRoadmapController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Retrieve skill gaps
router.get('/:studentId/:careerId', getSkillGaps);

// Authenticated shortcut: GET /skill-gaps/:careerSlug
router.get('/:careerSlug', authenticate, getSkillGaps);

export default router;
