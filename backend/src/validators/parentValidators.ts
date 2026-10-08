import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

const VALID_RELATIONSHIPS = ['Father', 'Mother', 'Guardian', 'Other'];
const VALID_RISK_LEVELS = ['low', 'medium', 'moderate', 'high'];

export const validateAddParent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const name = req.body.name || req.body.parentName;
  let relationship = req.body.relationship || req.body.relation || 'Guardian';

  if (relationship.includes('Father')) relationship = 'Father';
  else if (relationship.includes('Mother')) relationship = 'Mother';
  else if (!VALID_RELATIONSHIPS.includes(relationship)) relationship = 'Guardian';

  req.body.name = name;
  req.body.relationship = relationship;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new AppError('Parent name is required (minimum 2 characters)', 400, 'INVALID_NAME'));
  }

  if (!VALID_RELATIONSHIPS.includes(relationship)) {
    return next(
      new AppError(
        `Relationship must be one of: ${VALID_RELATIONSHIPS.join(', ')}`,
        400,
        'INVALID_RELATIONSHIP'
      )
    );
  }

  if (req.body.email && typeof req.body.email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email.trim())) {
    return next(new AppError('Invalid email format for parent', 400, 'INVALID_EMAIL'));
  }

  next();
};

export const validateParentSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { educationBudget, riskAppetite, stabilityPreference } = req.body;

  // Normalize 'moderate' -> 'medium'
  if (riskAppetite === 'moderate') {
    riskAppetite = 'medium';
    req.body.riskAppetite = 'medium';
  }
  if (stabilityPreference === 'moderate') {
    stabilityPreference = 'medium';
    req.body.stabilityPreference = 'medium';
  }

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
      new AppError('Risk appetite must be "low", "medium", "moderate", or "high"', 400, 'INVALID_RISK_APPETITE')
    );
  }

  if (stabilityPreference && !VALID_RISK_LEVELS.includes(stabilityPreference)) {
    return next(
      new AppError(
        'Stability preference must be "low", "medium", "moderate", or "high"',
        400,
        'INVALID_STABILITY_PREFERENCE'
      )
    );
  }

  next();
};
