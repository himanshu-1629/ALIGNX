import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Student } from '../models/Student';
import { Family } from '../models/Family';
import { Career } from '../models/Career';
import { Recommendation, IRecommendation } from '../models/Recommendation';
import { rankAllCareers, DEFAULT_WEIGHTS } from '../engine/scoringEngine';
import { LLMService } from '../services/llmService';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Generate career recommendations for a student using the ALIGNX Decision Engine
 * POST /api/v1/recommendations/:studentId/generate
 * POST /api/v1/recommendations/generate
 */
export const generateRecommendations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId || req.student?._id;
    const { location, weights } = req.body || {};

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw new AppError('Valid student ID is required', 400, 'INVALID_STUDENT_ID');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
    }

    // Retrieve family context if available
    const family = await Family.findOne({ studentId: student._id });

    // Retrieve all active careers from catalog
    const careers = await Career.find({});
    if (!careers || careers.length === 0) {
      throw new AppError('Career catalog is empty. Please run career seeder.', 500, 'CAREER_CATALOG_EMPTY');
    }

    // Execute ALIGNX deterministic mathematical scoring engine
    const rankingResults = rankAllCareers(student, family, careers, {
      weights: weights || DEFAULT_WEIGHTS,
      customLocation: location || student.location
    });

    // Optionally enrich top 3 careers with LLM narrative explanation
    if (rankingResults.length > 0) {
      const topCareerResult = rankingResults[0];
      const matchedCareerDoc = careers.find((c) => c._id.toString() === topCareerResult.careerId?.toString());
      if (matchedCareerDoc) {
        const llmExplanation = await LLMService.generateExplanation(
          student,
          matchedCareerDoc,
          topCareerResult.components,
          topCareerResult.overallScore
        );
        topCareerResult.explanationData = {
          whyItMatches: llmExplanation.strengths,
          potentialChallenges: llmExplanation.concerns,
          suggestedAlternatives: matchedCareerDoc.alternativeCareers || [],
          summary: llmExplanation.whyRecommended
        };
      }
    }

    // Save to Recommendation collection
    const recommendationDoc: IRecommendation = new Recommendation({
      studentId: student._id,
      engineVersion: '1.0',
      status: 'generated',
      weightsUsed: weights || DEFAULT_WEIGHTS,
      rankedCareers: rankingResults
    });

    await recommendationDoc.save();

    sendSuccess({
      res,
      statusCode: 201,
      message: 'Recommendations generated successfully',
      data: {
        recommendationId: recommendationDoc._id,
        engineVersion: recommendationDoc.engineVersion,
        totalCareersEvaluated: careers.length,
        recommendations: rankingResults.map((r) => ({
          careerId: r.careerId,
          careerSlug: r.careerSlug,
          careerName: r.careerName,
          rank: r.rank,
          overallScore: r.overallScore,
          studentFit: r.components.studentFit,
          financialFit: r.components.financialFit,
          familyAlignment: r.components.familyAlignment,
          marketFit: r.components.marketFit,
          locationFit: r.components.locationFit,
          affordabilityStatus: r.affordabilityStatus,
          explanation: r.explanationData
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest recommendations for a student
 * GET /api/v1/recommendations/:studentId
 * GET /api/v1/recommendations/me
 */
export const getRecommendations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId === 'me'
      ? req.student?._id
      : req.params.studentId || req.student?._id;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw new AppError('Valid student ID is required', 400, 'INVALID_STUDENT_ID');
    }

    const latestRecommendation = await Recommendation.findOne({ studentId })
      .sort({ createdAt: -1 });

    if (!latestRecommendation) {
      // If none found, automatically generate recommendations if student exists
      const student = await Student.findById(studentId);
      if (!student) {
        throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
      }

      // Delegate to generation
      req.params.studentId = studentId.toString();
      return generateRecommendations(req, res, next);
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Latest recommendations retrieved',
      data: {
        recommendationId: latestRecommendation._id,
        engineVersion: latestRecommendation.engineVersion,
        createdAt: latestRecommendation.createdAt,
        recommendations: latestRecommendation.rankedCareers.map((r) => ({
          careerId: r.careerId,
          careerSlug: r.careerSlug,
          careerName: r.careerName,
          rank: r.rank,
          overallScore: r.overallScore,
          studentFit: r.components.studentFit,
          financialFit: r.components.financialFit,
          familyAlignment: r.components.familyAlignment,
          marketFit: r.components.marketFit,
          locationFit: r.components.locationFit,
          affordabilityStatus: r.affordabilityStatus,
          explanation: r.explanationData
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed explanation for a recommendation
 * GET /api/v1/recommendations/:recommendationId/explanation
 */
export const getRecommendationExplanation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recommendationId } = req.params;
    const { careerSlug } = req.query;

    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
      throw new AppError('Valid recommendation ID required', 400, 'INVALID_RECOMMENDATION_ID');
    }

    const rec = await Recommendation.findById(recommendationId);
    if (!rec) {
      throw new AppError('Recommendation not found', 404, 'RECOMMENDATION_NOT_FOUND');
    }

    // Find requested career or fallback to rank 1 career
    const target = careerSlug
      ? rec.rankedCareers.find((r) => r.careerSlug === careerSlug)
      : rec.rankedCareers[0];

    if (!target) {
      throw new AppError('Target career not found in this recommendation', 404, 'CAREER_NOT_FOUND');
    }

    const student = await Student.findById(rec.studentId);
    const career = await Career.findOne({ slug: target.careerSlug });

    let explanation = target.explanationData;
    if ((!explanation || !explanation.summary) && student && career) {
      const llmExp = await LLMService.generateExplanation(
        student,
        career,
        target.components,
        target.overallScore
      );
      explanation = {
        whyItMatches: llmExp.strengths,
        potentialChallenges: llmExp.concerns,
        suggestedAlternatives: career.alternativeCareers || [],
        summary: llmExp.whyRecommended
      };
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Recommendation explanation retrieved',
      data: {
        recommendationId: rec._id,
        careerId: target.careerId,
        careerSlug: target.careerSlug,
        careerName: target.careerName,
        overallScore: target.overallScore,
        whyRecommended: explanation?.summary || 'High alignment across talent, finances, and market trends.',
        strengths: explanation?.whyItMatches || [],
        concerns: explanation?.potentialChallenges || [],
        suggestedAlternatives: explanation?.suggestedAlternatives || []
      }
    });
  } catch (error) {
    next(error);
  }
};
