import { Router } from 'express';
import { getCareers, getCareerBySlugOrId } from '../controllers/careerController';

const router = Router();

// Public routes for career catalog
router.get('/', getCareers);
router.get('/:slugOrId', getCareerBySlugOrId);

export default router;
