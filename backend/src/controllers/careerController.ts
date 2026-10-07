import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Career } from '../models/Career';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * List all careers with optional filtering
 * GET /api/v1/careers
 * Query: ?category=Technology&search=AI&location=Bangalore
 */
export const getCareers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, search, location } = req.query;

    const query: Record<string, any> = {};

    if (category && typeof category === 'string') {
      query.category = new RegExp(category.trim(), 'i');
    }

    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }, { slug: searchRegex }];
    }

    if (location && typeof location === 'string') {
      query['locationDemand.location'] = new RegExp(location.trim(), 'i');
    }

    const careers = await Career.find(query)
      .select('slug name category description riskLevel marketData salaryRange educationCost requiredSkills')
      .sort({ 'marketData.demandScore': -1 });

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Careers retrieved successfully',
      data: {
        total: careers.length,
        careers
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed career profile by slug or ObjectId
 * GET /api/v1/careers/:slugOrId
 */
export const getCareerBySlugOrId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    let career = null;

    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      career = await Career.findById(slugOrId);
    }

    if (!career) {
      career = await Career.findOne({ slug: slugOrId.toLowerCase().trim() });
    }

    if (!career) {
      throw new AppError(`Career "${slugOrId}" not found`, 404, 'CAREER_NOT_FOUND');
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Career profile retrieved',
      data: career
    });
  } catch (error) {
    next(error);
  }
};
