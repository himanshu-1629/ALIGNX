import { Router } from 'express';
import {
  addParentToFamily,
  getFamilyParentStatus,
  calculateFamilyAnalysis
} from '../controllers/parentController';

const router = Router();

// /families/:familyId/parents
router.post('/:familyId/parents', addParentToFamily);

// /families/:familyId/parents/status
router.get('/:familyId/parents/status', getFamilyParentStatus);

// /families/:familyId/analyze
router.post('/:familyId/analyze', calculateFamilyAnalysis);

export default router;
