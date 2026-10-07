import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student';
import { Family } from '../models/Family';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Register a new student
 * POST /api/v1/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      educationLevel = 'Student',
      location = 'India',
      age,
      branch,
      currentYear
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing email
    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      throw new AppError('Email address is already registered', 409, 'EMAIL_EXISTS');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create student
    const student = new Student({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      educationLevel: educationLevel.trim(),
      location: location.trim(),
      age: age ? Number(age) : undefined,
      branch: branch ? branch.trim() : undefined,
      currentYear: currentYear || undefined,
      interests: [],
      skills: [],
      goals: []
    });

    // Create associated Family container
    const family = new Family({
      studentId: student._id,
      parents: []
    });

    student.familyId = family._id;

    await Promise.all([student.save(), family.save()]);

    // Generate JWT access token
    const accessToken = generateToken({
      id: student._id.toString(),
      email: student.email
    });

    sendSuccess({
      res,
      statusCode: 201,
      message: 'Student registered successfully',
      data: {
        studentId: student._id,
        accessToken,
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          educationLevel: student.educationLevel,
          location: student.location,
          familyId: family._id
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login existing student
 * POST /api/v1/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find student
    const student = await Student.findOne({ email: normalizedEmail });
    if (!student || !student.passwordHash) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Compare password
    const isMatch = await comparePassword(password, student.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT access token
    const accessToken = generateToken({
      id: student._id.toString(),
      email: student.email
    });

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken,
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          educationLevel: student.educationLevel,
          location: student.location,
          familyId: student.familyId
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve current authenticated student profile
 * GET /api/v1/auth/me
 */
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student;

    if (!student) {
      throw new AppError('Student profile not found in session', 404, 'NOT_FOUND');
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Current student profile retrieved',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        educationLevel: student.educationLevel,
        location: student.location,
        age: student.age,
        branch: student.branch,
        currentYear: student.currentYear,
        interests: student.interests,
        skills: student.skills,
        goals: student.goals,
        careerDna: student.careerDna,
        aptitudeSnapshot: student.aptitudeSnapshot,
        familyId: student.familyId,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
