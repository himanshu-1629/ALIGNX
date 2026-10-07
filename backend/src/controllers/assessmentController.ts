import { Response, NextFunction } from 'express';
import { Assessment, AssessmentType } from '../models/Assessment';
import { Student } from '../models/Student';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Start a new assessment session
 * POST /api/v1/assessments/start
 */
export const startAssessment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;
    const { assessmentType } = req.body;

    if (!assessmentType || !['career_discovery', 'aptitude'].includes(assessmentType)) {
      throw new AppError(
        'Assessment type must be "career_discovery" or "aptitude"',
        400,
        'INVALID_ASSESSMENT_TYPE'
      );
    }

    const assessment = new Assessment({
      studentId: student._id,
      assessmentType: assessmentType as AssessmentType,
      status: 'started',
      startedAt: new Date(),
      responses: []
    });

    await assessment.save();

    sendSuccess({
      res,
      statusCode: 201,
      message: `${assessmentType} assessment session started`,
      data: {
        assessmentId: assessment._id,
        assessmentType: assessment.assessmentType,
        status: assessment.status,
        startedAt: assessment.startedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit an answer to an active assessment
 * POST /api/v1/assessments/:id/response
 */
export const submitAnswer = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { questionId, questionText, selectedOption, dimensionImpact } = req.body;

    if (!questionId || selectedOption === undefined) {
      throw new AppError('Question ID and selected option are required', 400, 'INVALID_RESPONSE');
    }

    const assessment = await Assessment.findOne({
      _id: id,
      studentId: req.student!._id
    });

    if (!assessment) {
      throw new AppError('Assessment session not found', 404, 'ASSESSMENT_NOT_FOUND');
    }

    if (assessment.status === 'completed') {
      throw new AppError('This assessment is already completed', 400, 'ASSESSMENT_ALREADY_COMPLETED');
    }

    // Upsert answer for this question
    const existingIndex = assessment.responses.findIndex((r) => r.questionId === questionId);
    const responsePayload = {
      questionId,
      questionText,
      selectedOption,
      dimensionImpact: dimensionImpact || {},
      answeredAt: new Date()
    };

    if (existingIndex > -1) {
      assessment.responses[existingIndex] = responsePayload;
    } else {
      assessment.responses.push(responsePayload);
    }

    await assessment.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Answer recorded',
      data: {
        questionId,
        totalResponses: assessment.responses.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete assessment and compute Career DNA / Aptitude Snapshot
 * POST /api/v1/assessments/:id/complete
 */
export const completeAssessment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const student = req.student!;
    const { responses, riasecScores, aptitudeScores, traitScores, scores } = req.body;

    const assessment = await Assessment.findOne({
      _id: id,
      studentId: student._id
    });

    if (!assessment) {
      throw new AppError('Assessment session not found', 404, 'ASSESSMENT_NOT_FOUND');
    }

    // Save batch responses if provided and assessment.responses is empty
    if (Array.isArray(responses) && responses.length > 0 && assessment.responses.length === 0) {
      assessment.responses = responses.map((r: any, idx: number) => ({
        questionId: String(r.questionId || idx + 1),
        questionText: r.questionText || `Question ${r.questionId || idx + 1}`,
        selectedOption: r.value ?? r.selectedOption ?? 0,
        dimensionImpact: r.dimensionImpact || {},
        answeredAt: new Date()
      })) as any;
    }

    assessment.status = 'completed';
    assessment.completedAt = new Date();

    const calculatedScores: Record<string, number> = {};

    if (assessment.assessmentType === 'aptitude') {
      const dimensions = ['logical', 'numerical', 'analytical', 'spatial', 'verbal'];
      const rawAptitude = aptitudeScores || scores || {};

      // Map frontend metric names if present
      const mappedInput: Record<string, number> = {
        logical: Number(rawAptitude.logical ?? rawAptitude.abstractLogic ?? 75),
        numerical: Number(rawAptitude.numerical ?? rawAptitude.quantitativeEstimation ?? 75),
        analytical: Number(rawAptitude.analytical ?? rawAptitude.systemsThinking ?? 75),
        spatial: Number(rawAptitude.spatial ?? rawAptitude.spatialArchitecture ?? 75),
        verbal: Number(rawAptitude.verbal ?? rawAptitude.riskTolerance ?? 75)
      };

      dimensions.forEach((dim) => {
        calculatedScores[dim] = mappedInput[dim];
      });

      // Also accumulate dimension impacts if available in responses
      if (assessment.responses && assessment.responses.length > 0) {
        assessment.responses.forEach((resp) => {
          if (resp.dimensionImpact) {
            const impactObj = resp.dimensionImpact instanceof Map
              ? Object.fromEntries(resp.dimensionImpact)
              : resp.dimensionImpact;

            Object.entries(impactObj).forEach(([dim, val]) => {
              const key = dim.toLowerCase();
              if (dimensions.includes(key)) {
                calculatedScores[key] = (calculatedScores[key] || 70) + Number(val);
              }
            });
          }
        });
      }

      // Clamp between 20 and 100
      dimensions.forEach((dim) => {
        calculatedScores[dim] = Math.min(100, Math.max(20, Math.round(calculatedScores[dim] || 75)));
      });

      student.aptitudeSnapshot = {
        logical: calculatedScores.logical,
        numerical: calculatedScores.numerical,
        analytical: calculatedScores.analytical,
        spatial: calculatedScores.spatial,
        verbal: calculatedScores.verbal,
        completedAt: new Date()
      };

      assessment.calculatedScores = calculatedScores;
      await Promise.all([assessment.save(), student.save()]);

      sendSuccess({
        res,
        statusCode: 200,
        message: 'Aptitude assessment completed successfully',
        data: {
          assessmentType: 'aptitude',
          aptitudeSnapshot: student.aptitudeSnapshot
        }
      });
      return;
    }

    if (assessment.assessmentType === 'career_discovery') {
      const traits = ['analytical', 'builder', 'research', 'creative', 'leadership', 'social', 'risk'];
      const rawRiasec = riasecScores || scores || {};

      // Parse RIASEC scores
      const r = Number(rawRiasec.realistic ?? rawRiasec.R ?? 65);
      const i = Number(rawRiasec.investigative ?? rawRiasec.I ?? 70);
      const a = Number(rawRiasec.artistic ?? rawRiasec.A ?? 60);
      const s = Number(rawRiasec.social ?? rawRiasec.S ?? 60);
      const e = Number(rawRiasec.enterprising ?? rawRiasec.E ?? 65);
      const c = Number(rawRiasec.conventional ?? rawRiasec.C ?? 65);

      // Synthesize trait scores from RIASEC
      calculatedScores.analytical = Math.round(0.6 * i + 0.4 * c);
      calculatedScores.builder = Math.round(0.7 * r + 0.3 * i);
      calculatedScores.research = Math.round(0.75 * i + 0.25 * r);
      calculatedScores.creative = Math.round(0.7 * a + 0.3 * i);
      calculatedScores.leadership = Math.round(0.75 * e + 0.25 * s);
      calculatedScores.social = Math.round(0.75 * s + 0.25 * e);
      calculatedScores.risk = Math.round(0.65 * e + 0.35 * r);

      // If direct traitScores provided, override
      if (traitScores && typeof traitScores === 'object') {
        traits.forEach((t) => {
          if (traitScores[t] !== undefined) {
            calculatedScores[t] = Number(traitScores[t]);
          }
        });
      }

      // Also accumulate dimension impacts if available in responses
      if (assessment.responses && assessment.responses.length > 0) {
        assessment.responses.forEach((resp) => {
          if (resp.dimensionImpact) {
            const impactObj = resp.dimensionImpact instanceof Map
              ? Object.fromEntries(resp.dimensionImpact)
              : resp.dimensionImpact;

            Object.entries(impactObj).forEach(([t, val]) => {
              const key = t.toLowerCase();
              if (calculatedScores[key] !== undefined) {
                calculatedScores[key] = calculatedScores[key] + Number(val);
              }
            });
          }
        });
      }

      // Clamp traits
      traits.forEach((t) => {
        calculatedScores[t] = Math.min(100, Math.max(20, Math.round(calculatedScores[t] || 65)));
      });

      // Rank traits
      const sortedTraits = Object.entries(calculatedScores).sort((a, b) => b[1] - a[1]);
      const topTraitKey = sortedTraits[0][0];
      const secondTraitKey = sortedTraits[1][0];

      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      const primaryTrait = `${capitalize(topTraitKey)} ${capitalize(secondTraitKey)}`;
      const secondaryTraits = sortedTraits.slice(2, 4).map(([t]) => capitalize(t));

      student.careerDna = {
        primaryTrait,
        secondaryTraits,
        traitScores: {
          analytical: calculatedScores.analytical,
          builder: calculatedScores.builder,
          research: calculatedScores.research,
          creative: calculatedScores.creative,
          leadership: calculatedScores.leadership,
          social: calculatedScores.social,
          risk: calculatedScores.risk
        },
        summary: `You exhibit a strong orientation as an ${primaryTrait}, characterized by high ${topTraitKey} intuition and systematic problem-solving capability.`
      };

      // Synchronize RIASEC interest profiles into student.interests
      const riasecDimensions: Array<{ name: string; score: number }> = [
        { name: 'Investigative', score: Math.round(i) },
        { name: 'Realistic', score: Math.round(r) },
        { name: 'Enterprising', score: Math.round(e) },
        { name: 'Conventional', score: Math.round(c) },
        { name: 'Artistic', score: Math.round(a) },
        { name: 'Social', score: Math.round(s) }
      ];

      student.interests = student.interests || [];
      riasecDimensions.forEach(({ name, score }) => {
        const existingIdx = student.interests.findIndex(
          (item) => item.name.toLowerCase() === name.toLowerCase()
        );
        if (existingIdx > -1) {
          student.interests[existingIdx].score = score;
          student.interests[existingIdx].category = 'riasec';
        } else {
          student.interests.push({ name, score, category: 'riasec' });
        }
      });

      assessment.calculatedScores = {
        ...calculatedScores,
        realistic: r,
        investigative: i,
        artistic: a,
        social: s,
        enterprising: e,
        conventional: c
      };

      await Promise.all([assessment.save(), student.save()]);

      sendSuccess({
        res,
        statusCode: 200,
        message: 'Career Discovery completed and Career DNA generated',
        data: {
          assessmentType: 'career_discovery',
          careerDna: student.careerDna,
          riasecScores: {
            realistic: r,
            investigative: i,
            artistic: a,
            social: s,
            enterprising: e,
            conventional: c
          }
        }
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get assessment history and active scores for student
 * GET /api/v1/assessments/history
 */
export const getAssessmentHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;

    const assessments = await Assessment.find({ studentId: student._id })
      .select('assessmentType status startedAt completedAt calculatedScores')
      .sort({ createdAt: -1 });

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Assessment history retrieved',
      data: {
        careerDna: student.careerDna || null,
        aptitudeSnapshot: student.aptitudeSnapshot || null,
        totalSessions: assessments.length,
        assessments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate or recalculate Career DNA directly
 * POST /api/v1/career-dna/:studentId/generate
 */
export const generateCareerDNA = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId === 'me'
      ? req.student?._id
      : req.params.studentId || req.student?._id;

    if (!studentId) {
      throw new AppError('Student ID is required', 400, 'INVALID_STUDENT_ID');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
    }

    // Synthesize trait scores from existing assessments, aptitude, or skills
    const baseScores: Record<string, number> = {
      analytical: 75,
      builder: 70,
      research: 65,
      creative: 60,
      leadership: 60,
      social: 55,
      risk: 65
    };

    if (student.aptitudeSnapshot) {
      baseScores.analytical = Math.min(100, Math.round((student.aptitudeSnapshot.logical + student.aptitudeSnapshot.analytical) / 2));
      baseScores.builder = Math.min(100, Math.round((student.aptitudeSnapshot.numerical + student.aptitudeSnapshot.spatial) / 2));
    }

    const studentSkillNames = (student.skills || []).map((s) => s.name.toLowerCase());
    if (studentSkillNames.some((s) => s.includes('python') || s.includes('code') || s.includes('data'))) {
      baseScores.analytical += 10;
      baseScores.builder += 10;
    }
    if (studentSkillNames.some((s) => s.includes('ai') || s.includes('ml') || s.includes('research'))) {
      baseScores.research += 15;
    }
    if (studentSkillNames.some((s) => s.includes('design') || s.includes('ui') || s.includes('ux'))) {
      baseScores.creative += 15;
    }

    // Clamp
    Object.keys(baseScores).forEach((k) => {
      baseScores[k] = Math.min(100, Math.max(30, baseScores[k]));
    });

    const sortedTraits = Object.entries(baseScores).sort((a, b) => b[1] - a[1]);
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const primaryTrait = `${capitalize(sortedTraits[0][0])} ${capitalize(sortedTraits[1][0])}`;
    const secondaryTraits = sortedTraits.slice(2, 4).map(([t]) => capitalize(t));

    student.careerDna = {
      primaryTrait,
      secondaryTraits,
      traitScores: {
        analytical: baseScores.analytical,
        builder: baseScores.builder,
        research: baseScores.research,
        creative: baseScores.creative,
        leadership: baseScores.leadership,
        social: baseScores.social,
        risk: baseScores.risk
      },
      summary: `You tend to enjoy solving complex problems and turning ideas into practical solutions as an ${primaryTrait}.`
    };

    await student.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Career DNA generated successfully',
      data: {
        primaryTrait: student.careerDna.primaryTrait,
        secondaryTraits: student.careerDna.secondaryTraits,
        traitScores: student.careerDna.traitScores,
        description: student.careerDna.summary
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student's Career DNA
 * GET /api/v1/career-dna/:studentId
 */
export const getCareerDNA = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId === 'me'
      ? req.student?._id
      : req.params.studentId || req.student?._id;

    if (!studentId) {
      throw new AppError('Student ID is required', 400, 'INVALID_STUDENT_ID');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
    }

    if (!student.careerDna) {
      // Auto-generate if not yet generated
      return generateCareerDNA(req, res, next);
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Career DNA retrieved',
      data: {
        primaryTrait: student.careerDna.primaryTrait,
        secondaryTraits: student.careerDna.secondaryTraits,
        traitScores: student.careerDna.traitScores,
        description: student.careerDna.summary
      }
    });
  } catch (error) {
    next(error);
  }
};

