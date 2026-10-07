import { Router } from 'express';
import { getCareerTwin } from '../controllers/careerTwinController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Support both POST and GET as per API spec
router.post('/:studentId/:careerId', getCareerTwin);
router.get('/:studentId/:careerId', getCareerTwin);

// Support current authenticated student routes
router.get('/:careerId', authenticate, (req, res, next) => {
  req.params.studentId = 'me';
  return getCareerTwin(req, res, next);
});

export default router;
