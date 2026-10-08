import { Router } from 'express';
import {
  addParentAndInvite,
  getInvitationDetails,
  submitParentForm,
  getParentStatus,
  resendInvitation,
  generateParentInvitation,
  directSubmitParentForm,
  removeParent
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

// Open & verify invitation link (Supports both /invite/:token and /invitation/:token)
router.get('/invite/:token', getInvitationDetails);
router.get('/invitation/:token', getInvitationDetails);

// Submit parent financial profile & expectations
router.post('/invite/:token/submit', validateParentSubmission, submitParentForm);
router.post('/invitation/:token/submit', validateParentSubmission, submitParentForm);

// ==========================================
// 2. PROTECTED ROUTES (For Students - JWT Auth)
// ==========================================

// Add a parent & generate invitation link
router.post('/invite', authenticate, validateAddParent, addParentAndInvite);

// Generate invitation for specific parent ID
router.post('/:parentId/invitation', generateParentInvitation);

// Live status of all parents & family alignment (supports / and /status)
router.get('/', authenticate, getParentStatus);
router.get('/status', authenticate, getParentStatus);

// Resend / regenerate invitation link for an existing parent
router.post('/:parentId/resend', authenticate, resendInvitation);

// Direct submit parent data by authenticated student (for immediate sync / simulation)
router.post('/:parentId/direct-submit', authenticate, directSubmitParentForm);

// Remove a parent from student's family
router.delete('/:parentId', authenticate, removeParent);

export default router;
