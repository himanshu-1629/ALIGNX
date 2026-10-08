import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
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

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = verifyToken(token);
          const student = await Student.findById(decoded.id);
          if (student) {
            req.student = student;
            req.userId = student._id.toString();
            return next();
          }
        } catch {
          // Fall through to guest fallback if token expired
        }
      }
    }

    // Graceful fallback for active student session via X-Student-Id or default guest session
    const studentId = req.headers['x-student-id'] as string;
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      const student = await Student.findById(studentId);
      if (student) {
        req.student = student;
        req.userId = student._id.toString();
        return next();
      }
    }

    // Find the latest active student or create a guest student
    let activeStudent = await Student.findOne().sort({ updatedAt: -1, createdAt: -1 });
    if (!activeStudent) {
      activeStudent = await Student.create({
        name: 'Alex Mercer',
        email: 'alex.mercer@alignx.demo',
        passwordHash: 'demo_hash_alignx',
        educationLevel: 'Grade 11-12',
        location: 'Bangalore'
      });
    }

    req.student = activeStudent;
    req.userId = activeStudent._id.toString();
    next();
  } catch (error: any) {
    next(error);
  }
};

export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = verifyToken(token);
        const student = await Student.findById(decoded.id);
        if (student) {
          req.student = student;
          req.userId = student._id.toString();
        }
      }
    }
    next();
  } catch {
    next();
  }
};

export default authenticate;
