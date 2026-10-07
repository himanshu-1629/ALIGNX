import { Response, NextFunction } from 'express';
import { Student } from '../models/Student';
import { Family } from '../models/Family';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

/**
 * Get current authenticated student profile
 * GET /api/v1/students/profile
 */
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;

    // Fetch linked family record with parent overview
    let familyData = null;
    if (student.familyId) {
      const family = await Family.findById(student.familyId).select(
        'parents._id parents.name parents.relationship parents.status alignmentAnalysis combinedFinancialContext'
      );
      if (family) {
        familyData = {
          id: family._id,
          parents: family.parents.map((p) => ({
            id: p._id,
            name: p.name,
            relationship: p.relationship,
            status: p.status
          })),
          alignmentAnalysis: family.alignmentAnalysis,
          combinedFinancialContext: family.combinedFinancialContext
        };
      }
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Student profile retrieved successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        age: student.age,
        educationLevel: student.educationLevel,
        currentYear: student.currentYear,
        branch: student.branch,
        location: student.location,
        interests: student.interests,
        skills: student.skills,
        goals: student.goals,
        careerDna: student.careerDna,
        aptitudeSnapshot: student.aptitudeSnapshot,
        family: familyData,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update student demographic and academic profile
 * PATCH /api/v1/students/profile
 */
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;
    const { name, age, educationLevel, currentYear, branch, location, goals } = req.body;

    if (name !== undefined) student.name = name.trim();
    if (age !== undefined) student.age = Number(age);
    if (educationLevel !== undefined) student.educationLevel = educationLevel.trim();
    if (currentYear !== undefined) student.currentYear = currentYear;
    if (branch !== undefined) student.branch = branch.trim();
    if (location !== undefined) student.location = location.trim();
    if (goals !== undefined && Array.isArray(goals)) {
      student.goals = goals.map((g: string) => g.trim()).filter(Boolean);
    }

    await student.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Student profile updated successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        age: student.age,
        educationLevel: student.educationLevel,
        currentYear: student.currentYear,
        branch: student.branch,
        location: student.location,
        goals: student.goals,
        updatedAt: student.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update or replace student skills
 * PUT /api/v1/students/skills
 */
export const updateSkills = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;
    const { skills, replace = true } = req.body;

    const formattedSkills = skills.map((s: any) => ({
      name: s.name.trim(),
      proficiency: Math.min(100, Math.max(0, Number(s.proficiency))),
      category: s.category || 'technical',
      source: s.source || 'student_input'
    }));

    if (replace) {
      student.skills = formattedSkills;
    } else {
      // Merge: update existing skill proficiency or append new one
      for (const newSkill of formattedSkills) {
        const existingIndex = student.skills.findIndex(
          (item) => item.name.toLowerCase() === newSkill.name.toLowerCase()
        );
        if (existingIndex > -1) {
          student.skills[existingIndex] = newSkill;
        } else {
          student.skills.push(newSkill);
        }
      }
    }

    await student.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Student skills updated successfully',
      data: {
        skillsCount: student.skills.length,
        skills: student.skills
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update or replace student interests
 * PUT /api/v1/students/interests
 */
export const updateInterests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;
    const { interests } = req.body;

    const formattedInterests = interests.map((item: any) => {
      if (typeof item === 'string') {
        return {
          name: item.trim(),
          score: 80,
          category: 'general'
        };
      }
      return {
        name: item.name.trim(),
        score: item.score !== undefined ? Math.min(100, Math.max(0, Number(item.score))) : 80,
        category: item.category || 'general'
      };
    });

    student.interests = formattedInterests;
    await student.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Student interests updated successfully',
      data: {
        interestsCount: student.interests.length,
        interests: student.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student by ID
 * GET /api/v1/students/:id
 */
export const getStudentById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const targetStudent = await Student.findById(id).select(
      'name age educationLevel currentYear branch location interests skills goals careerDna aptitudeSnapshot'
    );

    if (!targetStudent) {
      throw new AppError('Student not found', 404, 'STUDENT_NOT_FOUND');
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Student record retrieved',
      data: targetStudent
    });
  } catch (error) {
    next(error);
  }
};
