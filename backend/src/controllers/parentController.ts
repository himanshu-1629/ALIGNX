import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Family, IParent } from '../models/Family';
import { Student } from '../models/Student';
import { ParentInvitation } from '../models/ParentInvitation';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import {
  calculateAggregateFinancials,
  calculateConflictIndexAndAlignment
} from '../services/familyService';

/**
 * Add a parent/guardian and generate a secure invitation link
 * POST /api/v1/parents/invite
 */
export const addParentAndInvite = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;
    const { name, relationship, email, phone } = req.body;

    // Find or create family container for the student
    let family = await Family.findOne({ studentId: student._id });
    if (!family) {
      family = new Family({
        studentId: student._id,
        parents: []
      });
      student.familyId = family._id;
      await student.save();
    }

    // Create parent subdocument
    const newParent: IParent = {
      _id: new mongoose.Types.ObjectId(),
      name: name.trim(),
      relationship,
      status: 'pending',
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone ? phone.trim() : undefined
    };

    family.parents.push(newParent);

    // Generate secure token
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days expiration

    // Persist invitation
    const invitation = new ParentInvitation({
      studentId: student._id,
      familyId: family._id,
      parentId: newParent._id,
      token: rawToken,
      tokenHash,
      expiresAt,
      status: 'pending'
    });

    await Promise.all([family.save(), invitation.save()]);

    sendSuccess({
      res,
      statusCode: 201,
      message: 'Parent added and invitation link generated',
      data: {
        parentId: newParent._id,
        parentName: newParent.name,
        relationship: newParent.relationship,
        status: newParent.status,
        invitationToken: rawToken,
        invitationUrl: `/parent/invite/${rawToken}`,
        expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Open and verify an invitation link (Public - Passwordless for parents)
 * GET /api/v1/parents/invite/:token
 */
export const getInvitationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new AppError('Invitation token is required', 400, 'TOKEN_REQUIRED');
    }

    const invitation = await ParentInvitation.findOne({ token });

    if (!invitation) {
      throw new AppError('Invalid or nonexistent invitation link', 404, 'INVITATION_NOT_FOUND');
    }

    if (invitation.status === 'used') {
      throw new AppError('This invitation has already been completed', 400, 'INVITATION_ALREADY_USED');
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      throw new AppError('This invitation link has expired. Please ask the student to resend it.', 410, 'INVITATION_EXPIRED');
    }

    // Retrieve family and student info
    const [family, student] = await Promise.all([
      Family.findById(invitation.familyId),
      Student.findById(invitation.studentId).select('name educationLevel location')
    ]);

    if (!family || !student) {
      throw new AppError('Student or family context no longer exists', 404, 'NOT_FOUND');
    }

    const parent = family.parents.find((p) => p._id?.toString() === invitation.parentId.toString());
    if (!parent) {
      throw new AppError('Parent entry not found in family record', 404, 'PARENT_NOT_FOUND');
    }

    // Transition status to 'filling' if it was 'pending'
    if (parent.status === 'pending') {
      parent.status = 'filling';
      await family.save();
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Invitation is valid',
      data: {
        valid: true,
        studentName: student.name,
        studentEducation: student.educationLevel,
        studentLocation: student.location,
        parentId: parent._id,
        parentName: parent.name,
        relationship: parent.relationship,
        status: parent.status,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit parent financial capacity and career expectations (Public - Passwordless)
 * POST /api/v1/parents/invite/:token/submit
 */
export const submitParentForm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    const {
      incomeRange,
      educationBudget,
      riskAppetite = 'medium',
      locationPreference,
      stabilityPreference = 'medium',
      preferredDomains = [],
      educationExpectations = [],
      priorityFactors = [],
      additionalNotes
    } = req.body;

    const invitation = await ParentInvitation.findOne({ token });

    if (!invitation) {
      throw new AppError('Invalid invitation token', 404, 'INVITATION_NOT_FOUND');
    }

    if (invitation.status === 'used') {
      throw new AppError('This invitation link has already been used', 400, 'INVITATION_ALREADY_USED');
    }

    if (new Date() > invitation.expiresAt) {
      throw new AppError('This invitation link has expired', 410, 'INVITATION_EXPIRED');
    }

    const [family, student] = await Promise.all([
      Family.findById(invitation.familyId),
      Student.findById(invitation.studentId)
    ]);

    if (!family || !student) {
      throw new AppError('Associated student or family record not found', 404, 'NOT_FOUND');
    }

    const parent = family.parents.find((p) => p._id?.toString() === invitation.parentId.toString());
    if (!parent) {
      throw new AppError('Parent record not found in family', 404, 'PARENT_NOT_FOUND');
    }

    // Update parent profile
    parent.status = 'completed';
    parent.submittedAt = new Date();
    parent.financialProfile = {
      incomeRange: incomeRange ? String(incomeRange).trim() : undefined,
      educationBudget: Number(educationBudget) || 0,
      riskAppetite,
      locationPreference: locationPreference ? String(locationPreference).trim() : undefined,
      stabilityPreference
    };
    parent.expectations = {
      preferredDomains: Array.isArray(preferredDomains) ? preferredDomains : [],
      educationExpectations: Array.isArray(educationExpectations) ? educationExpectations : [],
      priorityFactors: Array.isArray(priorityFactors) ? priorityFactors : [],
      additionalNotes: additionalNotes ? String(additionalNotes).trim() : undefined
    };

    // Mark invitation as used
    invitation.status = 'used';
    invitation.usedAt = new Date();

    // Recalculate combined financials and conflict index
    family.combinedFinancialContext = calculateAggregateFinancials(family);
    family.alignmentAnalysis = calculateConflictIndexAndAlignment(student, family);

    await Promise.all([family.save(), invitation.save()]);

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Parent information submitted successfully',
      data: {
        status: 'completed',
        parentId: parent._id,
        parentName: parent.name,
        relationship: parent.relationship,
        submittedAt: parent.submittedAt,
        combinedFinancialContext: family.combinedFinancialContext,
        alignmentAnalysis: family.alignmentAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get status of all parents for the logged-in student's family
 * GET /api/v1/parents/status
 */
export const getParentStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;

    const family = await Family.findOne({ studentId: student._id });
    if (!family) {
      sendSuccess({
        res,
        statusCode: 200,
        message: 'No family record registered yet',
        data: {
          totalParents: 0,
          parents: [],
          combinedFinancialContext: null,
          alignmentAnalysis: null
        }
      });
      return;
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Parent status retrieved',
      data: {
        familyId: family._id,
        totalParents: family.parents.length,
        parents: family.parents.map((p) => ({
          parentId: p._id,
          name: p.name,
          relationship: p.relationship,
          status: p.status,
          submittedAt: p.submittedAt,
          budgetProvided: p.status === 'completed'
        })),
        combinedFinancialContext: family.combinedFinancialContext,
        alignmentAnalysis: family.alignmentAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend / regenerate invitation token for an existing parent
 * POST /api/v1/parents/:parentId/resend
 */
export const resendInvitation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;
    const { parentId } = req.params;

    const family = await Family.findOne({ studentId: student._id });
    if (!family) {
      throw new AppError('Family record not found', 404, 'FAMILY_NOT_FOUND');
    }

    const parent = family.parents.find((p) => p._id?.toString() === parentId);
    if (!parent) {
      throw new AppError('Parent not found in family', 404, 'PARENT_NOT_FOUND');
    }

    // Expire previous pending invitations
    await ParentInvitation.updateMany(
      { parentId: parent._id, status: 'pending' },
      { status: 'expired' }
    );

    // Generate new invitation token
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const newInvitation = new ParentInvitation({
      studentId: student._id,
      familyId: family._id,
      parentId: parent._id,
      token: rawToken,
      tokenHash,
      expiresAt,
      status: 'pending'
    });

    // Reset status to pending if it was filling
    if (parent.status === 'filling') {
      parent.status = 'pending';
      await family.save();
    }

    await newInvitation.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'New invitation link generated successfully',
      data: {
        parentId: parent._id,
        parentName: parent.name,
        invitationToken: rawToken,
        invitationUrl: `/parent/invite/${rawToken}`,
        expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};
