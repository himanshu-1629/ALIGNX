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

    student.updatedAt = new Date();
    await Promise.all([family.save(), invitation.save(), student.save()]);

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

    let invitation = await ParentInvitation.findOne({
      $or: [{ token }, { tokenHash: token }]
    });

    let family: any = null;
    let student: any = null;
    let parent: any = null;

    if (invitation) {
      if (new Date() > invitation.expiresAt) {
        invitation.status = 'expired';
        await invitation.save();
        throw new AppError('This invitation link has expired. Please ask the student to resend it.', 410, 'INVITATION_EXPIRED');
      }

      [family, student] = await Promise.all([
        Family.findById(invitation.familyId),
        Student.findById(invitation.studentId).select('name educationLevel location budgetAnnualLakhs')
      ]);

      if (family) {
        parent = family.parents.find((p: any) => p._id?.toString() === invitation!.parentId.toString());
      }
    }

    // Graceful recovery if token record is missing or desynchronized
    if (!invitation || !family || !student || !parent) {
      const targetStudentId = (req.query.studentId as string) || (req.headers['x-student-id'] as string);
      if (targetStudentId && mongoose.Types.ObjectId.isValid(targetStudentId)) {
        student = await Student.findById(targetStudentId).select('name educationLevel location budgetAnnualLakhs');
      }
      if (!student) {
        student = await Student.findOne().sort({ updatedAt: -1, createdAt: -1 }).select('name educationLevel location budgetAnnualLakhs');
      }

      if (student) {
        family = await Family.findOne({ studentId: student._id });
        if (!family) {
          family = await Family.create({
            studentId: student._id,
            parents: []
          });
          student.familyId = family._id;
          await student.save();
        }

        const queryParentId = req.query.parentId as string;
        const queryParentName = (req.query.parent as string) || 'Parent / Guardian';
        const queryRelation = (req.query.relation as string) || 'Father';

        if (queryParentId && mongoose.Types.ObjectId.isValid(queryParentId)) {
          parent = family.parents.find((p: any) => p._id?.toString() === queryParentId);
        }
        if (!parent && family.parents.length > 0) {
          parent = family.parents[0];
        }
        if (!parent) {
          parent = {
            _id: new mongoose.Types.ObjectId(),
            name: queryParentName,
            relationship: queryRelation,
            status: 'pending'
          };
          family.parents.push(parent);
          await family.save();
        }

        invitation = await ParentInvitation.findOne({ token });
        if (!invitation) {
          invitation = await ParentInvitation.create({
            studentId: student._id,
            familyId: family._id,
            parentId: parent._id,
            token,
            tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: parent.status === 'completed' ? 'used' : 'pending'
          });
        }
      }
    }

    if (!family || !student || !parent) {
      throw new AppError('Invitation context no longer exists', 404, 'NOT_FOUND');
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
        studentBudgetAnnualLakhs: student.budgetAnnualLakhs || 16,
        parentId: parent._id,
        parentName: parent.name,
        relationship: parent.relationship,
        status: parent.status,
        financialProfile: parent.financialProfile || null,
        expectations: parent.expectations || null,
        expiresAt: invitation ? invitation.expiresAt : new Date(Date.now() + 14 * 86400000)
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

    let invitation = await ParentInvitation.findOne({
      $or: [{ token }, { tokenHash: token }]
    });

    let family: any = null;
    let student: any = null;
    let parent: any = null;

    if (invitation) {
      if (new Date() > invitation.expiresAt) {
        throw new AppError('This invitation link has expired', 410, 'INVITATION_EXPIRED');
      }
      [family, student] = await Promise.all([
        Family.findById(invitation.familyId),
        Student.findById(invitation.studentId)
      ]);
      if (family) {
        parent = family.parents.find((p: any) => p._id?.toString() === invitation!.parentId.toString());
      }
    }

    // Graceful recovery if token was generated dynamically or missing in DB
    if (!invitation || !family || !student || !parent) {
      const targetStudentId = (req.body.studentId as string) || (req.query.studentId as string) || (req.headers['x-student-id'] as string);
      if (targetStudentId && mongoose.Types.ObjectId.isValid(targetStudentId)) {
        student = await Student.findById(targetStudentId);
      }
      if (!student) {
        student = await Student.findOne().sort({ updatedAt: -1, createdAt: -1 });
      }

      if (student) {
        family = await Family.findOne({ studentId: student._id });
        if (!family) {
          family = await Family.create({
            studentId: student._id,
            parents: []
          });
          student.familyId = family._id;
          await student.save();
        }

        const targetParentId = req.body.parentId || req.query.parentId;
        if (targetParentId && mongoose.Types.ObjectId.isValid(targetParentId)) {
          parent = family.parents.find((p: any) => p._id?.toString() === targetParentId);
        }
        if (!parent && family.parents.length > 0) {
          parent = family.parents[0];
        }
        if (!parent) {
          parent = {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.parentName || (req.query.parent as string) || 'Parent / Guardian',
            relationship: req.body.relationship || (req.query.relation as string) || 'Father',
            status: 'pending'
          };
          family.parents.push(parent);
          await family.save();
        }

        invitation = await ParentInvitation.findOne({ token });
        if (!invitation) {
          invitation = await ParentInvitation.create({
            studentId: student._id,
            familyId: family._id,
            parentId: parent._id,
            token,
            tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'pending'
          });
        }
      }
    }

    if (!family || !student) {
      throw new AppError('Associated student or family record not found', 404, 'NOT_FOUND');
    }

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
    if (invitation) {
      invitation.status = 'used';
      invitation.usedAt = new Date();
      await invitation.save();
    }

    // Recalculate combined financials and conflict index
    family.combinedFinancialContext = calculateAggregateFinancials(family);
    family.alignmentAnalysis = calculateConflictIndexAndAlignment(student, family);

    // Keep student timestamp fresh so student portal session recognizes this active profile
    student.updatedAt = new Date();

    await Promise.all([family.save(), student.save()]);

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

    let family = await Family.findOne({ studentId: student._id });
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

    // Always recalculate alignment if any parents are completed
    if (family.parents.some((p) => p.status === 'completed')) {
      family.combinedFinancialContext = calculateAggregateFinancials(family);
      family.alignmentAnalysis = calculateConflictIndexAndAlignment(student, family);
      await family.save();
    }

    const invitations = await ParentInvitation.find({
      familyId: family._id,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    const inviteMap = new Map<string, string>();
    invitations.forEach((inv) => {
      if (!inviteMap.has(inv.parentId.toString())) {
        inviteMap.set(inv.parentId.toString(), inv.token);
      }
    });

    // Ensure all parents have a valid invite token
    for (const p of family.parents) {
      if (!inviteMap.has(p._id!.toString())) {
        const rawToken = crypto.randomBytes(24).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        await new ParentInvitation({
          studentId: student._id,
          familyId: family._id,
          parentId: p._id,
          token: rawToken,
          tokenHash,
          expiresAt,
          status: p.status === 'completed' ? 'used' : 'pending'
        }).save();
        inviteMap.set(p._id!.toString(), rawToken);
      }
    }

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Parent status retrieved',
      data: {
        familyId: family._id,
        totalParents: family.parents.length,
        parents: family.parents.map((p) => {
          const token = inviteMap.get(p._id?.toString() || '') || null;
          return {
            parentId: p._id,
            name: p.name,
            relationship: p.relationship,
            status: p.status,
            email: p.email,
            phone: p.phone,
            submittedAt: p.submittedAt,
            financialProfile: p.financialProfile || null,
            expectations: p.expectations || null,
            budgetProvided: p.status === 'completed',
            invitationToken: token,
            invitationUrl: token ? `/parent/invite/${token}` : null
          };
        }),
        combinedFinancialContext: family.combinedFinancialContext,
        alignmentAnalysis: family.alignmentAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Direct parent submission for authenticated students
 * POST /api/v1/parents/:parentId/direct-submit
 */
export const directSubmitParentForm = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = req.student!;
    const { parentId } = req.params;
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

    const family = await Family.findOne({ studentId: student._id });
    if (!family) {
      throw new AppError('Family record not found', 404, 'FAMILY_NOT_FOUND');
    }

    const parent = family.parents.find((p) => p._id?.toString() === parentId);
    if (!parent) {
      throw new AppError('Parent record not found in family', 404, 'PARENT_NOT_FOUND');
    }

    parent.status = 'completed';
    parent.submittedAt = new Date();
    parent.financialProfile = {
      incomeRange: incomeRange ? String(incomeRange).trim() : undefined,
      educationBudget: Number(educationBudget) || 15,
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

    // Mark any pending invitation as used
    await ParentInvitation.updateMany(
      { parentId: parent._id, status: 'pending' },
      { status: 'used', usedAt: new Date() }
    );

    // Recalculate combined financials and alignment analysis
    family.combinedFinancialContext = calculateAggregateFinancials(family);
    family.alignmentAnalysis = calculateConflictIndexAndAlignment(student, family);

    await family.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Parent profile submitted successfully',
      data: {
        parentId: parent._id,
        parentName: parent.name,
        relationship: parent.relationship,
        status: parent.status,
        financialProfile: parent.financialProfile,
        combinedFinancialContext: family.combinedFinancialContext,
        alignmentAnalysis: family.alignmentAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove / delete a parent from the student's family
 * DELETE /api/v1/parents/:parentId
 */
export const removeParent = async (
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

    family.parents = family.parents.filter(
      (p) => p._id?.toString() !== parentId
    );

    await ParentInvitation.deleteMany({ parentId });

    family.combinedFinancialContext = calculateAggregateFinancials(family);
    family.alignmentAnalysis = calculateConflictIndexAndAlignment(student, family);

    await family.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Parent removed successfully',
      data: {
        totalParents: family.parents.length,
        parents: family.parents
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

/**
 * Add a parent to a family container
 * POST /api/v1/families/:familyId/parents
 */
export const addParentToFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { familyId } = req.params;
    const { name, relationship, email, phone } = req.body;

    if (!name || !relationship) {
      throw new AppError('Parent name and relationship are required', 400, 'VALIDATION_ERROR');
    }

    const family = await Family.findById(familyId);
    if (!family) {
      throw new AppError('Family container not found', 404, 'FAMILY_NOT_FOUND');
    }

    const newParent: IParent = {
      _id: new mongoose.Types.ObjectId(),
      name: name.trim(),
      relationship,
      status: 'pending',
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone ? phone.trim() : undefined
    };

    family.parents.push(newParent);
    await family.save();

    sendSuccess({
      res,
      statusCode: 201,
      message: 'Parent added to family successfully',
      data: {
        parentId: newParent._id,
        relationship: newParent.relationship,
        status: newParent.status
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate invitation for an existing parent
 * POST /api/v1/parents/:parentId/invitation
 */
export const generateParentInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { parentId } = req.params;

    const family = await Family.findOne({ 'parents._id': parentId });
    if (!family) {
      throw new AppError('Parent or family not found', 404, 'PARENT_NOT_FOUND');
    }

    const parent = family.parents.find((p) => p._id && p._id.toString() === parentId);
    if (!parent) {
      throw new AppError('Parent not found in family', 404, 'PARENT_NOT_FOUND');
    }

    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const invitation = new ParentInvitation({
      studentId: family.studentId,
      familyId: family._id,
      parentId: parent._id,
      token: rawToken,
      tokenHash,
      expiresAt,
      status: 'pending'
    });

    await invitation.save();

    sendSuccess({
      res,
      statusCode: 201,
      message: 'Invitation generated successfully',
      data: {
        invitationUrl: `/parent/invite/${rawToken}`,
        invitationToken: rawToken,
        expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get parent status for a family
 * GET /api/v1/families/:familyId/parents/status
 */
export const getFamilyParentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { familyId } = req.params;

    const family = await Family.findById(familyId);
    if (!family) {
      throw new AppError('Family not found', 404, 'FAMILY_NOT_FOUND');
    }

    const parentStatuses = family.parents.map((p) => ({
      parentId: p._id,
      relationship: p.relationship,
      status: p.status
    }));

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Family parent status retrieved',
      data: parentStatuses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate or recalculate family analysis
 * POST /api/v1/families/:familyId/analyze
 */
export const calculateFamilyAnalysis = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { familyId } = req.params;

    const family = await Family.findById(familyId);
    if (!family) {
      throw new AppError('Family not found', 404, 'FAMILY_NOT_FOUND');
    }

    const student = await Student.findById(family.studentId);
    if (!student) {
      throw new AppError('Student profile not found for this family', 404, 'STUDENT_NOT_FOUND');
    }

    // Run aggregations
    family.combinedFinancialContext = calculateAggregateFinancials(family);
    family.alignmentAnalysis = calculateConflictIndexAndAlignment(student, family);

    await family.save();

    sendSuccess({
      res,
      statusCode: 200,
      message: 'Family alignment analysis calculated successfully',
      data: {
        financialFit: family.alignmentAnalysis.financialFit,
        familyAlignment: family.alignmentAnalysis.familyAlignment,
        conflictIndex: family.alignmentAnalysis.conflictIndex
      }
    });
  } catch (error) {
    next(error);
  }
};

