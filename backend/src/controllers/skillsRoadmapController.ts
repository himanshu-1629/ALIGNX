import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Student } from '../models/Student';
import { Career } from '../models/Career';
import { SkillGap, ISingleSkillGap } from '../models/SkillGap';
import { Roadmap, IRoadmap } from '../models/Roadmap';
import { LLMService } from '../services/llmService';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Calculate and return skill gaps for a student and a career
 * GET /api/v1/skill-gaps/:studentId/:careerId
 * GET /api/v1/skill-gaps/:careerSlug (authenticated student)
 */
export const getSkillGaps = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const careerIdOrSlug = req.params.careerSlug || req.params.careerId;
    const studentId = req.params.studentId || req.student?._id?.toString();

    if (!careerIdOrSlug) {
      throw new AppError('Career ID or slug is required', 400, 'INVALID_CAREER_ID');
    }

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw new AppError('Valid student ID required', 400, 'INVALID_STUDENT_ID');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
    }

    const career = mongoose.Types.ObjectId.isValid(careerIdOrSlug)
      ? await Career.findById(careerIdOrSlug)
      : await Career.findOne({ slug: careerIdOrSlug });

    if (!career) {
      throw new AppError('Career not found', 404, 'CAREER_NOT_FOUND');
    }

    const singleGaps: ISingleSkillGap[] = [];
    const priorityGaps: string[] = [];

    const reqSkills = career.requiredSkills || [];

    reqSkills.forEach((reqSkill) => {
      const matched = student.skills.find(
        (s) => s.name.toLowerCase() === reqSkill.skillName.toLowerCase()
      );

      const currentLevel = matched ? matched.proficiency : 20;
      const requiredLevel = reqSkill.requiredLevel || 75;
      const gap = Math.max(0, requiredLevel - currentLevel);

      let priority: 'high' | 'medium' | 'low' = 'low';
      if (gap > 35) {
        priority = 'high';
        priorityGaps.push(reqSkill.skillName);
      } else if (gap > 15) {
        priority = 'medium';
      }

      singleGaps.push({
        skillName: reqSkill.skillName,
        category: (reqSkill.category as 'technical' | 'soft' | 'domain') || 'technical',
        currentLevel,
        requiredLevel,
        gap,
        priority
      });
    });

    // Upsert into SkillGap analysis collection
    const skillGapDoc = await SkillGap.findOneAndUpdate(
      { studentId: student._id, careerSlug: career.slug },
      {
        studentId: student._id,
        careerId: career._id,
        careerSlug: career.slug,
        careerName: career.name,
        gaps: singleGaps,
        priorityGaps
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Skill gap analysis computed successfully',
      data: {
        analysisId: skillGapDoc._id,
        career: career.name,
        careerSlug: career.slug,
        skills: singleGaps.map((g) => ({
          name: g.skillName,
          category: g.category,
          current: g.currentLevel,
          required: g.requiredLevel,
          gap: g.gap,
          priority: g.priority
        })),
        priorityGaps
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate a phased learning roadmap
 * POST /api/v1/roadmaps/:studentId/:careerId
 * POST /api/v1/roadmaps/generate/:careerSlug (authenticated)
 */
export const generateRoadmap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const careerIdOrSlug = req.params.careerSlug || req.params.careerId;
    const studentId = req.params.studentId || req.student?._id?.toString();

    if (!careerIdOrSlug) {
      throw new AppError('Career ID or slug is required', 400, 'INVALID_CAREER_ID');
    }

    let student = null;
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      student = await Student.findById(studentId);
    }
    if (!student && req.student?._id) {
      student = await Student.findById(req.student._id);
    }
    if (!student) {
      student = await Student.findOne().sort({ updatedAt: -1 });
    }
    if (!student) {
      student = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Demo Student',
        academicLevel: 'ug',
        skills: [],
        aptitudeSnapshot: { logical: 85, numerical: 80, analytical: 88, spatial: 75, verbal: 80 }
      } as any;
    }

    const normalizedSlug = careerIdOrSlug.replace(/_/g, '-');
    let career = mongoose.Types.ObjectId.isValid(careerIdOrSlug)
      ? await Career.findById(careerIdOrSlug)
      : await Career.findOne({
          $or: [
            { slug: careerIdOrSlug },
            { slug: normalizedSlug },
            { slug: careerIdOrSlug.replace(/-/g, '_') }
          ]
        });

    if (!career) {
      const primaryKeyword = careerIdOrSlug.split(/[-_]/)[0];
      if (primaryKeyword && primaryKeyword.length >= 3) {
        career = await Career.findOne({
          slug: { $regex: new RegExp(primaryKeyword, 'i') }
        });
      }
    }

    if (!career) {
      career = await Career.findOne();
    }

    if (!career) {
      throw new AppError('Career not found', 404, 'CAREER_NOT_FOUND');
    }

    // Retrieve skill gaps
    const existingGapDoc = await SkillGap.findOne({
      studentId: student._id,
      careerSlug: career.slug
    });

    const gaps: ISingleSkillGap[] = existingGapDoc
      ? existingGapDoc.gaps
      : (career.requiredSkills || []).map((rs) => ({
          skillName: rs.skillName,
          category: 'technical',
          currentLevel: 25,
          requiredLevel: rs.requiredLevel || 75,
          gap: Math.max(0, (rs.requiredLevel || 75) - 25),
          priority: 'high'
        }));

    // Call LLM service to synthesize personalized roadmap
    const generatedPlan = await LLMService.generateRoadmap(student, career, gaps);

    // Save or update in Roadmap collection
    const roadmapDoc: IRoadmap = await Roadmap.findOneAndUpdate(
      { studentId: student._id, careerId: career._id },
      {
        studentId: student._id,
        careerId: career._id,
        careerName: career.name,
        title: generatedPlan.roadmapTitle,
        description: generatedPlan.description,
        targetRole: generatedPlan.targetRole,
        milestones: generatedPlan.milestones
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Group milestones by phase for presentation
    const phaseNames = ['Foundation', 'Skill Development', 'Projects & Portfolio', 'Professional Readiness'];
    const phases = [1, 2, 3, 4].map((pNum) => ({
      phaseNumber: pNum,
      title: phaseNames[pNum - 1] || `Phase ${pNum}`,
      items: roadmapDoc.milestones.filter((m) => m.phase === pNum)
    }));

    sendSuccess({
      res,
      statusCode: 201,
      message: 'Learning roadmap generated successfully',
      data: {
        roadmapId: roadmapDoc._id,
        career: career.name,
        careerSlug: career.slug,
        title: roadmapDoc.title,
        description: roadmapDoc.description,
        phases
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get existing roadmap for a student and career
 * GET /api/v1/roadmaps/:studentId/:careerId
 * GET /api/v1/roadmaps/:roadmapId
 */
export const getRoadmap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId || req.student?._id?.toString();
    const careerId = req.params.careerSlug || req.params.careerId;
    const roadmapId = req.params.roadmapId;

    let roadmapDoc = null;

    if (roadmapId && mongoose.Types.ObjectId.isValid(roadmapId)) {
      roadmapDoc = await Roadmap.findById(roadmapId);
    } else if (careerId) {
      const normalizedSlug = careerId.replace(/_/g, '-');
      let career = mongoose.Types.ObjectId.isValid(careerId)
        ? await Career.findById(careerId)
        : await Career.findOne({
            $or: [
              { slug: careerId },
              { slug: normalizedSlug },
              { slug: careerId.replace(/-/g, '_') }
            ]
          });

      if (!career) {
        const primaryKeyword = careerId.split(/[-_]/)[0];
        if (primaryKeyword && primaryKeyword.length >= 3) {
          career = await Career.findOne({
            slug: { $regex: new RegExp(primaryKeyword, 'i') }
          });
        }
      }

      if (career) {
        roadmapDoc = await Roadmap.findOne({
          careerId: career._id
        }).sort({ updatedAt: -1 });
      }
    }

    if (!roadmapDoc) {
      // Auto-trigger roadmap generation if career was provided
      if (careerId) {
        return generateRoadmap(req, res, next);
      }
      throw new AppError('Roadmap not found', 404, 'ROADMAP_NOT_FOUND');
    }

    const phaseNames = ['Foundation', 'Skill Development', 'Projects & Portfolio', 'Professional Readiness'];
    const phases = [1, 2, 3, 4].map((pNum) => ({
      phaseNumber: pNum,
      title: phaseNames[pNum - 1] || `Phase ${pNum}`,
      items: roadmapDoc!.milestones.filter((m) => m.phase === pNum)
    }));

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Roadmap retrieved successfully',
      data: {
        roadmapId: roadmapDoc._id,
        career: roadmapDoc.careerName,
        title: roadmapDoc.title,
        description: roadmapDoc.description,
        phases
      }
    });
  } catch (error) {
    next(error);
  }
};
