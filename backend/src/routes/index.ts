import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import assessmentRoutes from './assessmentRoutes';
import careerDnaRoutes from './careerDnaRoutes';
import parentRoutes from './parentRoutes';
import familyRoutes from './familyRoutes';
import careerRoutes from './careerRoutes';
import recommendationRoutes from './recommendationRoutes';
import careerTwinRoutes from './careerTwinRoutes';
import skillGapRoutes from './skillGapRoutes';
import roadmapRoutes from './roadmapRoutes';
import simulatorRoutes from './simulatorRoutes';
import dashboardRoutes from './dashboardRoutes';
import marketRoutes from './marketRoutes';

const router = Router();

/**
 * Health check endpoint
 * GET /api/v1/health
 */
router.get('/health', (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  sendSuccess({
    res,
    statusCode: 200,
    message: 'ALIGNX API is operational',
    data: {
      status: 'healthy',
      service: 'ALIGNX Backend',
      version: '1.0.0',
      database: {
        status: dbStatusMap[dbState] || 'unknown',
        name: mongoose.connection.name || 'dataquest'
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// Authentication routes (/api/v1/auth)
router.use('/auth', authRoutes);

// Student profile & onboarding routes (/api/v1/students)
router.use('/students', studentRoutes);

// Career Discovery & Aptitude assessment routes (/api/v1/assessments)
router.use('/assessments', assessmentRoutes);

// Career DNA routes (/api/v1/career-dna)
router.use('/career-dna', careerDnaRoutes);

// Parent invitation & family routes (/api/v1/parents & /api/v1/families)
router.use('/parents', parentRoutes);
router.use('/families', familyRoutes);

// Career knowledge catalog routes (/api/v1/careers)
router.use('/careers', careerRoutes);

// ALIGNX Decision Engine recommendations (/api/v1/recommendations)
router.use('/recommendations', recommendationRoutes);

// Career Twin matching routes (/api/v1/career-twin)
router.use('/career-twin', careerTwinRoutes);

// Skill Gaps analysis routes (/api/v1/skill-gaps)
router.use('/skill-gaps', skillGapRoutes);

// Phased Roadmaps routes (/api/v1/roadmaps)
router.use('/roadmaps', roadmapRoutes);

// What-If Simulator routes (/api/v1/simulator)
router.use('/simulator', simulatorRoutes);

// Unified Dashboard routes (/api/v1/dashboard)
router.use('/dashboard', dashboardRoutes);

// Market & location demand routes (/api/v1/market)
router.use('/market', marketRoutes);

export default router;
