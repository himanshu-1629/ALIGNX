import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

const VALID_RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Other'];
const VALID_RISK_LEVELS = ['low', 'medium', 'high'];

export const validateAddParent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, relationship, email, phone } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new AppError('Parent name is required (minimum 2 characters)', 400, 'INVALID_NAME'));
  }

  if (!relationship || !VALID_RELATIONSHIPS.includes(relationship)) {
    return next(
      new AppError(
        `Relationship must be one of: ${VALID_RELATIONSHIPS.join(', ')}`,
        400,
        'INVALID_RELATIONSHIP'
      )
    );
  }

  if (email && typeof email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return next(new AppError('Invalid email format for parent', 400, 'INVALID_EMAIL'));
  }

  next();
};

export const validateParentSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { educationBudget, riskAppetite, stabilityPreference } = req.body;

  if (educationBudget === undefined || typeof educationBudget !== 'number' || educationBudget < 0) {
    return next(
      new AppError(
        'Education budget is required and must be a non-negative number',
        400,
        'INVALID_BUDGET'
      )
    );
  }

  if (riskAppetite && !VALID_RISK_LEVELS.includes(riskAppetite)) {
    return next(
      new AppError('Risk appetite must be "low", "medium", or "high"', 400, 'INVALID_RISK_APPETITE')
    );
  }

  if (stabilityPreference && !VALID_RISK_LEVELS.includes(stabilityPreference)) {
    return next(
      new AppError(
        'Stability preference must be "low", "medium", or "high"',
        400,
        'INVALID_STABILITY_PREFERENCE'
      )
    );
  }

  next();
};
