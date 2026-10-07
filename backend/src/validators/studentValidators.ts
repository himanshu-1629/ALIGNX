import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export const validateProfileUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, age, educationLevel, location, goals } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return next(new AppError('Name must be at least 2 characters long', 400, 'INVALID_NAME'));
  }

  if (age !== undefined && (typeof age !== 'number' || age < 10 || age > 100)) {
    return next(new AppError('Age must be a valid number between 10 and 100', 400, 'INVALID_AGE'));
  }

  if (educationLevel !== undefined && (typeof educationLevel !== 'string' || !educationLevel.trim())) {
    return next(new AppError('Education level cannot be empty', 400, 'INVALID_EDUCATION_LEVEL'));
  }

  if (location !== undefined && (typeof location !== 'string' || !location.trim())) {
    return next(new AppError('Location cannot be empty', 400, 'INVALID_LOCATION'));
  }

  if (goals !== undefined && !Array.isArray(goals)) {
    return next(new AppError('Goals must be an array of strings', 400, 'INVALID_GOALS'));
  }

  next();
};

export const validateSkillsUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { skills } = req.body;

  if (!Array.isArray(skills)) {
    return next(new AppError('Skills must be an array of skill objects', 400, 'INVALID_SKILLS_FORMAT'));
  }

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    if (!skill.name || typeof skill.name !== 'string' || !skill.name.trim()) {
      return next(new AppError(`Skill at index ${i} must have a valid name`, 400, 'INVALID_SKILL_NAME'));
    }
    if (typeof skill.proficiency !== 'number' || skill.proficiency < 0 || skill.proficiency > 100) {
      return next(
        new AppError(
          `Skill "${skill.name}" must have a proficiency score between 0 and 100`,
          400,
          'INVALID_PROFICIENCY'
        )
      );
    }
    if (skill.category && !['technical', 'soft', 'domain'].includes(skill.category)) {
      return next(
        new AppError(
          `Skill "${skill.name}" category must be "technical", "soft", or "domain"`,
          400,
          'INVALID_SKILL_CATEGORY'
        )
      );
    }
  }

  next();
};

export const validateInterestsUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { interests } = req.body;

  if (!Array.isArray(interests)) {
    return next(new AppError('Interests must be an array of interest items', 400, 'INVALID_INTERESTS_FORMAT'));
  }

  for (let i = 0; i < interests.length; i++) {
    const interest = interests[i];
    // Can be string array or object array with score
    if (typeof interest === 'string') {
      if (!interest.trim()) {
        return next(new AppError(`Interest item at index ${i} cannot be empty`, 400, 'INVALID_INTEREST'));
      }
    } else if (typeof interest === 'object' && interest !== null) {
      if (!interest.name || typeof interest.name !== 'string' || !interest.name.trim()) {
        return next(new AppError(`Interest at index ${i} must have a valid name`, 400, 'INVALID_INTEREST_NAME'));
      }
      if (
        interest.score !== undefined &&
        (typeof interest.score !== 'number' || interest.score < 0 || interest.score > 100)
      ) {
        return next(
          new AppError(
            `Interest "${interest.name}" score must be between 0 and 100`,
            400,
            'INVALID_INTEREST_SCORE'
          )
        );
      }
    } else {
      return next(new AppError(`Interest at index ${i} has an invalid format`, 400, 'INVALID_INTEREST_FORMAT'));
    }
  }

  next();
};
