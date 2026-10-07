import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { Student, IStudent } from '../models/Student';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  student?: IStudent;
  userId?: string;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token required', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authentication token missing', 401, 'UNAUTHORIZED');
    }

    const decoded = verifyToken(token);
    const student = await Student.findById(decoded.id);

    if (!student) {
      throw new AppError('Student account not found', 401, 'USER_NOT_FOUND');
    }

    req.student = student;
    req.userId = student._id.toString();
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid authentication token', 401, 'INVALID_TOKEN'));
      return;
    }
    if (error.name === 'TokenExpiredError') {
      next(new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED'));
      return;
    }
    next(error);
  }
};

export default authenticate;
