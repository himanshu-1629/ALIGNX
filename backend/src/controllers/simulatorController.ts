import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Student, IStudent } from '../models/Student';
import { Family } from '../models/Family';
import { Career } from '../models/Career';
import { WhatIfScenario, IWhatIfCareerRankResult } from '../models/WhatIfScenario';
import { rankAllCareers, DEFAULT_WEIGHTS } from '../engine/scoringEngine';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Run a What-If simulation without mutating actual student/family profile
 * POST /api/v1/simulator/:studentId
 * POST /api/v1/simulator/run
 */
export const runSimulator = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId || req.student?._id;
    const {
      educationBudget,
      location,
      riskAppetite,
      timeToEmployment,
      additionalSkills,
      scenarioName
    } = req.body || {};

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw new AppError('Valid student ID required', 400, 'INVALID_STUDENT_ID');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student profile not found', 404, 'STUDENT_NOT_FOUND');
    }

    const family = await Family.findOne({ studentId: student._id });
    const careers = await Career.find({});

    if (!careers || careers.length === 0) {
      throw new AppError('No careers available in catalog', 500, 'CAREER_CATALOG_EMPTY');
    }

    // 1. Calculate baseline original rankings
    const originalRankings = rankAllCareers(student, family, careers, {
      weights: DEFAULT_WEIGHTS,
      customLocation: student.location
    });

    // 2. Prepare simulated student in memory (non-mutating)
    const simulatedStudent: IStudent = JSON.parse(JSON.stringify(student));

    if (location) {
      simulatedStudent.location = location;
    }

    if (Array.isArray(additionalSkills) && additionalSkills.length > 0) {
      additionalSkills.forEach((skillName: string) => {
        const existing = simulatedStudent.skills.find(
          (s) => s.name.toLowerCase() === skillName.toLowerCase()
        );
        if (existing) {
          existing.proficiency = Math.min(100, existing.proficiency + 20);
        } else {
          simulatedStudent.skills.push({
            name: skillName,
            proficiency: 75,
            source: 'student_input'
          });
        }
      });
    }

    // 3. Prepare simulated family in memory
    let simulatedFamily = family ? JSON.parse(JSON.stringify(family)) : null;
    if (simulatedFamily && riskAppetite) {
      if (!simulatedFamily.combinedFinancialContext) {
        simulatedFamily.combinedFinancialContext = {};
      }
      simulatedFamily.combinedFinancialContext.averageRiskAppetite = riskAppetite;
    }

    // 4. Run the EXACT same Decision Engine on simulated parameters
    const simulatedRankings = rankAllCareers(simulatedStudent, simulatedFamily, careers, {
      weights: DEFAULT_WEIGHTS,
      customBudget: educationBudget !== undefined ? Number(educationBudget) : undefined,
      customLocation: location || student.location
    });

    // 5. Compare baseline vs simulated to compute deltas
    const originalRankMap = new Map<string, { rank: number; score: number }>();
    originalRankings.forEach((r) => {
      originalRankMap.set(r.careerSlug, { rank: r.rank, score: r.overallScore });
    });

    const keyShifts: string[] = [];
    const changes: Array<{
      careerId: mongoose.Types.ObjectId;
      careerSlug: string;
      careerName: string;
      previousScore: number;
      newScore: number;
      change: number;
      previousRank: number;
      newRank: number;
    }> = [];

    const enrichedSimulated: Array<IWhatIfCareerRankResult & { careerId: mongoose.Types.ObjectId; affordabilityStatus: string }> = [];

    simulatedRankings.forEach((sim) => {
      const orig = originalRankMap.get(sim.careerSlug) || { rank: sim.rank, score: sim.overallScore };
      const scoreDelta = sim.overallScore - orig.score;
      const rankDelta = orig.rank - sim.rank; // Positive means moved up in ranking

      enrichedSimulated.push({
        careerId: sim.careerId!,
        careerSlug: sim.careerSlug,
        careerName: sim.careerName,
        overallScore: sim.overallScore,
        rank: sim.rank,
        scoreDelta,
        rankDelta,
        affordabilityStatus: sim.affordabilityStatus
      });

      if (scoreDelta !== 0 || rankDelta !== 0) {
        changes.push({
          careerId: sim.careerId!,
          careerSlug: sim.careerSlug,
          careerName: sim.careerName,
          previousScore: orig.score,
          newScore: sim.overallScore,
          change: scoreDelta,
          previousRank: orig.rank,
          newRank: sim.rank
        });
      }

      if (rankDelta >= 2) {
        keyShifts.push(
          `${sim.careerName} climbed ${rankDelta} positions (now Rank ${sim.rank}, score +${scoreDelta}) under this scenario.`
        );
      } else if (rankDelta <= -2) {
        keyShifts.push(
          `${sim.careerName} slipped ${Math.abs(rankDelta)} positions due to relative parameter shifts.`
        );
      }
    });

    if (keyShifts.length === 0) {
      keyShifts.push('Rankings remained stable with subtle score adjustments.');
    }

    // 6. Save scenario in WhatIfScenario collection
    const scenarioDoc = new WhatIfScenario({
      studentId: student._id,
      scenarioName: scenarioName || `Simulation (${location || 'Budget Adjustment'})`,
      inputs: {
        educationBudget: educationBudget !== undefined ? Number(educationBudget) : undefined,
        location,
        riskAppetite,
        timeToEmployment,
        additionalSkills: Array.isArray(additionalSkills) ? additionalSkills : []
      },
      results: {
        originalRankings: originalRankings.map((r) => ({
          careerSlug: r.careerSlug,
          careerName: r.careerName,
          overallScore: r.overallScore,
          rank: r.rank
        })),
        simulatedRankings: enrichedSimulated.map((r) => ({
          careerSlug: r.careerSlug,
          careerName: r.careerName,
          overallScore: r.overallScore,
          rank: r.rank,
          scoreDelta: r.scoreDelta,
          rankDelta: r.rankDelta
        })),
        keyShifts
      }
    });

    await scenarioDoc.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'What-If scenario simulation evaluated successfully',
      data: {
        scenarioId: scenarioDoc._id,
        scenario: {
          educationBudget: educationBudget !== undefined ? Number(educationBudget) : undefined,
          location: location || student.location,
          riskAppetite: riskAppetite || 'medium',
          timeToEmployment: timeToEmployment || 'medium'
        },
        recommendations: enrichedSimulated,
        changes,
        keyShifts
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get history of past What-If simulations for a student
 * GET /api/v1/simulator/history
 * GET /api/v1/simulator/:studentId
 */
export const getSimulationHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId || req.student?._id;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw new AppError('Valid student ID required', 400, 'INVALID_STUDENT_ID');
    }

    const scenarios = await WhatIfScenario.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(10);

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Simulation history retrieved',
      data: scenarios
    });
  } catch (error) {
    next(error);
  }
};
