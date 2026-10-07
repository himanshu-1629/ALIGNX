import { Router } from 'express';
import { generateCareerDNA, getCareerDNA } from '../controllers/assessmentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Allow authenticated student access
router.post('/generate', authenticate, (req, res, next) => {
  req.params.studentId = 'me';
  return generateCareerDNA(req, res, next);
});

router.post('/:studentId/generate', generateCareerDNA);

router.get('/me', authenticate, (req, res, next) => {
  req.params.studentId = 'me';
  return getCareerDNA(req, res, next);
});

router.get('/:studentId', getCareerDNA);

export default router;
