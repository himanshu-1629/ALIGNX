import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Student } from '../models/Student';
import { Family } from '../models/Family';
import { Recommendation } from '../models/Recommendation';
import { SkillGap } from '../models/SkillGap';
import { Roadmap } from '../models/Roadmap';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Unified Dashboard API for single-roundtrip fast client loading
 * GET /api/v1/dashboard/:studentId
 * GET /api/v1/dashboard/me
 */
export const getStudentDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId === 'me'
      ? req.student?._id
      : req.params.studentId || req.student?._id;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw new AppError('Valid student ID required', 400, 'INVALID_STUDENT_ID');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
    }

    // Parallel fetch for speed
    const [family, latestRec, skillGaps, roadmaps] = await Promise.all([
      Family.findOne({ studentId: student._id }),
      Recommendation.findOne({ studentId: student._id }).sort({ createdAt: -1 }),
      SkillGap.find({ studentId: student._id }).limit(5),
      Roadmap.find({ studentId: student._id }).sort({ updatedAt: -1 }).limit(1)
    ]);

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Dashboard data aggregated successfully',
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          age: student.age,
          educationLevel: student.educationLevel,
          location: student.location,
          skills: student.skills,
          interests: student.interests,
          goals: student.goals,
          aptitudeSnapshot: student.aptitudeSnapshot || null
        },
        careerDNA: student.careerDna || null,
        parents: family?.parents?.map((p) => ({
          parentId: p._id,
          relationship: p.relationship,
          name: p.name,
          status: p.status
        })) || [],
        familyAnalysis: family?.alignmentAnalysis || {
          financialFit: 75,
          familyAlignment: 75,
          conflictIndex: 0
        },
        recommendations: latestRec?.rankedCareers?.slice(0, 5) || [],
        skillGaps: skillGaps || [],
        roadmap: roadmaps && roadmaps.length > 0 ? roadmaps[0] : null
      }
    });
  } catch (error) {
    next(error);
  }
};
