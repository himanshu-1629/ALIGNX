import { Router } from 'express';
import {
  addParentAndInvite,
  getInvitationDetails,
  submitParentForm,
  getParentStatus,
  resendInvitation
} from '../controllers/parentController';
import {
  validateAddParent,
  validateParentSubmission
} from '../validators/parentValidators';
import { authenticate } from '../middleware/auth';

const router = Router();

// ==========================================
// 1. PUBLIC ROUTES (For Parents - Passwordless)
// ==========================================

// Open & verify invitation link
router.get('/invite/:token', getInvitationDetails);

// Submit parent financial profile & expectations
router.post('/invite/:token/submit', validateParentSubmission, submitParentForm);

// ==========================================
// 2. PROTECTED ROUTES (For Students - JWT Auth)
// ==========================================

// Add a parent & generate invitation link
router.post('/invite', authenticate, validateAddParent, addParentAndInvite);

// Live status of all parents & family alignment
router.get('/status', authenticate, getParentStatus);

// Resend / regenerate invitation link for an existing parent
router.post('/:parentId/resend', authenticate, resendInvitation);

export default router;
