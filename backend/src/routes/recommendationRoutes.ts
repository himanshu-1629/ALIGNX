import { Router } from 'express';
import {
  generateRecommendations,
  getRecommendations,
  getRecommendationExplanation
} from '../controllers/recommendationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Generation endpoints
router.post('/generate', authenticate, generateRecommendations);
router.post('/:studentId/generate', generateRecommendations);

// Retrieval endpoints
router.get('/me', authenticate, getRecommendations);
router.get('/explanation/:recommendationId', getRecommendationExplanation);
router.get('/:recommendationId/explanation', getRecommendationExplanation);
router.get('/:studentId', getRecommendations);

export default router;
