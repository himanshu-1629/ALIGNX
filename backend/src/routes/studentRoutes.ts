import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateSkills,
  updateInterests,
  getStudentById
} from '../controllers/studentController';
import {
  validateProfileUpdate,
  validateSkillsUpdate,
  validateInterestsUpdate
} from '../validators/studentValidators';
import { authenticate } from '../middleware/auth';

const router = Router();

// All student routes require authentication
router.use(authenticate);

// Profile management
router.get('/profile', getProfile);
router.patch('/profile', validateProfileUpdate, updateProfile);

// Skills and Interests management
router.put('/skills', validateSkillsUpdate, updateSkills);
router.put('/interests', validateInterestsUpdate, updateInterests);

// Public profile lookup by ID
router.get('/:id', getStudentById);

export default router;
