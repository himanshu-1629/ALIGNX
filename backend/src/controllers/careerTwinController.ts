import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Student } from '../models/Student';
import { Career } from '../models/Career';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Generate or retrieve Career Twin matching analysis
 * POST /api/v1/career-twin/:studentId/:careerId
 * GET /api/v1/career-twin/:studentId/:careerId
 */
export const getCareerTwin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId === 'me'
      ? req.student?._id
      : req.params.studentId || req.student?._id;
    const { careerId } = req.params;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw new AppError('Valid student ID required', 400, 'INVALID_STUDENT_ID');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
    }

    // Resolve career by ObjectId or slug
    const career = mongoose.Types.ObjectId.isValid(careerId)
      ? await Career.findById(careerId)
      : await Career.findOne({ slug: careerId });

    if (!career) {
      throw new AppError('Career not found', 404, 'CAREER_NOT_FOUND');
    }

    // 1. Aptitude Match (0 - 100)
    let aptitudeScore = 75;
    if (student.aptitudeSnapshot && career.aptitudeProfile) {
      const snap = student.aptitudeSnapshot;
      const prof = career.aptitudeProfile;
      const diffs = [
        Math.abs(snap.logical - prof.logical),
        Math.abs(snap.numerical - prof.numerical),
        Math.abs(snap.analytical - prof.analytical),
        Math.abs(snap.spatial - prof.spatial),
        Math.abs(snap.verbal - prof.verbal)
      ];
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      aptitudeScore = Math.min(100, Math.max(30, Math.round(100 - avgDiff * 0.75)));
    }

    // 2. Interest Match (0 - 100)
    let interestScore = 70;
    if (student.interests && student.interests.length > 0 && career.interestProfile) {
      const studentIntNames = student.interests.map((i) => i.name.toLowerCase());
      let matches = 0;
      career.interestProfile.forEach((cp) => {
        if (
          studentIntNames.some(
            (si) => si.includes(cp.interest.toLowerCase()) || cp.interest.toLowerCase().includes(si)
          )
        ) {
          matches++;
        }
      });
      if (career.interestProfile.length > 0) {
        interestScore = Math.min(100, Math.round(50 + (matches / career.interestProfile.length) * 50));
      }
    }

    // 3. Skills Match & Gaps
    const strengths: string[] = [];
    const gaps: string[] = [];
    let earnedSkillWeight = 0;
    let totalSkillWeight = 0;

    if (career.requiredSkills && career.requiredSkills.length > 0) {
      career.requiredSkills.forEach((reqSkill) => {
        const weight = reqSkill.importance || 70;
        totalSkillWeight += weight;

        const studentSkill = student.skills.find(
          (s) => s.name.toLowerCase() === reqSkill.skillName.toLowerCase()
        );

        if (studentSkill && studentSkill.proficiency >= (reqSkill.requiredLevel || 70) * 0.8) {
          earnedSkillWeight += weight;
          strengths.push(`${reqSkill.skillName} (${studentSkill.proficiency}% proficiency)`);
        } else {
          const currentProf = studentSkill ? studentSkill.proficiency : 20;
          earnedSkillWeight += (currentProf / (reqSkill.requiredLevel || 70)) * weight;
          gaps.push(`${reqSkill.skillName} (Target: ${reqSkill.requiredLevel}%)`);
        }
      });
    }

    const skillsScore = totalSkillWeight > 0
      ? Math.min(100, Math.max(30, Math.round((earnedSkillWeight / totalSkillWeight) * 100)))
      : 70;

    // 4. Career DNA Match
    let careerDNAScore = 75;
    if (student.careerDna && student.careerDna.traitScores) {
      const topTrait = student.careerDna.primaryTrait?.toLowerCase() || '';
      if (topTrait.includes('analytical') || topTrait.includes('builder')) {
        careerDNAScore = 90;
      } else {
        careerDNAScore = 80;
      }
    }

    const matchScore = Math.round(
      aptitudeScore * 0.3 + interestScore * 0.25 + skillsScore * 0.3 + careerDNAScore * 0.15
    );

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Career Twin profile calculated successfully',
      data: {
        careerId: career._id,
        careerSlug: career.slug,
        careerName: career.name,
        matchScore,
        strengths: strengths.length > 0 ? strengths : ['Strong intellectual foundation for role requirements'],
        gaps: gaps.length > 0 ? gaps : ['Advanced specialization projects'],
        matchingDimensions: {
          aptitude: aptitudeScore,
          interest: interestScore,
          skills: skillsScore,
          careerDNA: careerDNAScore
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
