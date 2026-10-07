import { Router, Request, Response, NextFunction } from 'express';
import {
  startAssessment,
  submitAnswer,
  completeAssessment,
  getAssessmentHistory
} from '../controllers/assessmentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Specific Career Discovery Aliases (as in API Docs Section 10)
router.post('/career-discovery/start', (req: Request, res: Response, next: NextFunction) => {
  req.body.assessmentType = 'career_discovery';
  return startAssessment(req, res, next);
});
router.post('/career-discovery/:id/response', submitAnswer);
router.post('/career-discovery/:id/complete', completeAssessment);

// Specific Aptitude Aliases (as in API Docs Section 11)
router.post('/aptitude/start', (req: Request, res: Response, next: NextFunction) => {
  req.body.assessmentType = 'aptitude';
  return startAssessment(req, res, next);
});
router.post('/aptitude/:id/response', submitAnswer);
router.post('/aptitude/:id/complete', completeAssessment);

// General session endpoints
router.post('/start', startAssessment);
router.post('/:id/response', submitAnswer);
router.post('/:id/complete', completeAssessment);
router.get('/history', getAssessmentHistory);

export default router;
