import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import parentRoutes from './parentRoutes';

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

// Parent invitation & family intelligence routes (/api/v1/parents)
router.use('/parents', parentRoutes);

export default router;
