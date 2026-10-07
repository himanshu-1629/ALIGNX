import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Career } from '../models/Career';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Get market demand metrics for a career
 * GET /api/v1/market/careers/:careerId
 */
export const getCareerMarketData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { careerId } = req.params;

    const career = mongoose.Types.ObjectId.isValid(careerId)
      ? await Career.findById(careerId)
      : await Career.findOne({ slug: careerId });

    if (!career) {
      throw new AppError('Career not found', 404, 'CAREER_NOT_FOUND');
    }

    const market = career.marketData || {
      demandScore: 85,
      growthScore: 82,
      hiringVelocity: 80,
      stabilityScore: 85
    };

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Career market data retrieved',
      data: {
        careerId: career._id,
        careerSlug: career.slug,
        careerName: career.name,
        demandScore: market.demandScore,
        growthScore: market.growthScore,
        hiringVelocity: market.hiringVelocity,
        stabilityScore: market.stabilityScore,
        salaryRange: career.salaryRange,
        riskLevel: career.riskLevel
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get regional location demand clusters for a career
 * GET /api/v1/market/careers/:careerId/locations
 */
export const getCareerLocationDemand = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { careerId } = req.params;

    const career = mongoose.Types.ObjectId.isValid(careerId)
      ? await Career.findById(careerId)
      : await Career.findOne({ slug: careerId });

    if (!career) {
      throw new AppError('Career not found', 404, 'CAREER_NOT_FOUND');
    }

    const locationDemand = career.locationDemand && career.locationDemand.length > 0
      ? career.locationDemand
      : [
          { location: 'Bangalore', demandScore: 94, opportunityScore: 96 },
          { location: 'Hyderabad', demandScore: 88, opportunityScore: 90 },
          { location: 'Pune', demandScore: 85, opportunityScore: 86 },
          { location: 'Chennai', demandScore: 82, opportunityScore: 84 },
          { location: 'Delhi NCR', demandScore: 86, opportunityScore: 88 }
        ];

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Career location demand retrieved',
      data: locationDemand
    });
  } catch (error) {
    next(error);
  }
};
