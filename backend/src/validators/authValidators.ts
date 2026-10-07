import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new AppError('Valid name is required (minimum 2 characters)', 400, 'INVALID_NAME'));
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return next(new AppError('A valid email address is required', 400, 'INVALID_EMAIL'));
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400, 'INVALID_PASSWORD'));
  }

  next();
};

export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return next(new AppError('A valid email address is required', 400, 'INVALID_EMAIL'));
  }

  if (!password || typeof password !== 'string') {
    return next(new AppError('Password is required', 400, 'PASSWORD_REQUIRED'));
  }

  next();
};
