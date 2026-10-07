import mongoose, { Schema, Document, Model } from 'mongoose';

export type ParentStatus = 'pending' | 'filling' | 'completed';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface IParentFinancialProfile {
  incomeRange?: string;
  educationBudget: number; // Max annual/degree contribution in currency units (INR)
  riskAppetite: RiskLevel;
  locationPreference?: string;
  stabilityPreference?: RiskLevel;
}

export interface IParentExpectations {
  preferredDomains: string[];
  educationExpectations: string[];
  priorityFactors: string[]; // e.g. ['stability', 'salary', 'cost', 'prestige']
  additionalNotes?: string;
}

export interface IParent {
  _id?: mongoose.Types.ObjectId;
  name: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  status: ParentStatus;
  email?: string;
  phone?: string;
  financialProfile?: IParentFinancialProfile;
  expectations?: IParentExpectations;
  submittedAt?: Date;
}

export interface IFamilyAlignmentAnalysis {
  financialFit: number; // 0 - 100
  conflictIndex: number; // 0 - 100 (higher = greater discrepancy)
  familyAlignment: number; // 0 - 100
  conflictReasons: string[];
  compromiseSuggestions: string[];
}

export interface IFamily extends Document {
  studentId: mongoose.Types.ObjectId;
  parents: IParent[];
  combinedFinancialContext?: {
    totalEducationBudget: number;
    averageRiskAppetite: RiskLevel;
  };
  alignmentAnalysis?: IFamilyAlignmentAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

const ParentFinancialProfileSchema = new Schema<IParentFinancialProfile>(
  {
    incomeRange: { type: String, trim: true },
    educationBudget: { type: Number, default: 0, min: 0 },
    riskAppetite: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    locationPreference: { type: String, trim: true },
    stabilityPreference: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  { _id: false }
);

const ParentExpectationsSchema = new Schema<IParentExpectations>(
  {
    preferredDomains: [{ type: String, trim: true }],
    educationExpectations: [{ type: String, trim: true }],
    priorityFactors: [{ type: String, trim: true }],
    additionalNotes: { type: String, trim: true }
  },
  { _id: false }
);

const ParentSchema = new Schema<IParent>(
  {
    name: { type: String, required: true, trim: true },
    relationship: {
      type: String,
      enum: ['Father', 'Mother', 'Guardian', 'Other'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'filling', 'completed'],
      default: 'pending'
    },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    financialProfile: { type: ParentFinancialProfileSchema },
    expectations: { type: ParentExpectationsSchema },
    submittedAt: { type: Date }
  },
  { _id: true }
);

const FamilyAlignmentAnalysisSchema = new Schema<IFamilyAlignmentAnalysis>(
  {
    financialFit: { type: Number, default: 0, min: 0, max: 100 },
    conflictIndex: { type: Number, default: 0, min: 0, max: 100 },
    familyAlignment: { type: Number, default: 0, min: 0, max: 100 },
    conflictReasons: [{ type: String }],
    compromiseSuggestions: [{ type: String }]
  },
  { _id: false }
);

const FamilySchema = new Schema<IFamily>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      unique: true,
      index: true
    },
    parents: [ParentSchema],
    combinedFinancialContext: {
      totalEducationBudget: { type: Number, default: 0 },
      averageRiskAppetite: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    },
    alignmentAnalysis: { type: FamilyAlignmentAnalysisSchema }
  },
  {
    timestamps: true
  }
);

export const Family: Model<IFamily> =
  mongoose.models.Family || mongoose.model<IFamily>('Family', FamilySchema);

export default Family;
