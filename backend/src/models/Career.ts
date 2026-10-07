import mongoose, { Schema, Document, Model } from 'mongoose';

export type CareerRiskLevel = 'low' | 'medium' | 'high';

export interface ICareerRequiredSkill {
  skillName: string;
  category: 'technical' | 'soft' | 'domain';
  importance: number; // 0 - 100
  requiredLevel: number; // 0 - 100 benchmark
}

export interface ICareerAptitudeProfile {
  logical: number;
  numerical: number;
  analytical: number;
  spatial: number;
  verbal: number;
}

export interface ICareerInterestMatch {
  interest: string;
  importance: number; // 0 - 100
}

export interface ICareerEducationPathway {
  minimumDegree: string;
  preferredDegrees: string[];
  typicalDurationYears: number;
  topColleges?: string[];
}

export interface ICareerEducationCost {
  minCost: number;
  maxCost: number;
  averageCost: number;
  currency: string;
}

export interface ICareerSalaryRange {
  entryLevel: number;
  midLevel: number;
  seniorLevel: number;
  currency: string;
}

export interface ICareerMarketData {
  demandScore: number; // 0 - 100
  growthScore: number; // 0 - 100
  hiringVelocity: number; // 0 - 100
  stabilityScore: number; // 0 - 100
  futureOutlook?: string;
}

export interface ICareerLocationDemand {
  location: string;
  demandScore: number; // 0 - 100
  opportunityScore: number; // 0 - 100
  costIndex?: number;
}

export interface ICareerExam {
  name: string;
  type?: string;
  difficulty?: string;
}

export interface ICareerScholarship {
  name: string;
  provider?: string;
  maxAmount?: number;
  eligibility?: string;
}

export interface ICareer extends Document {
  slug: string;
  name: string;
  category: string;
  description: string;
  riskLevel: CareerRiskLevel;
  requiredSkills: ICareerRequiredSkill[];
  aptitudeProfile: ICareerAptitudeProfile;
  interestProfile: ICareerInterestMatch[];
  educationPathway: ICareerEducationPathway;
  educationCost: ICareerEducationCost;
  salaryRange: ICareerSalaryRange;
  marketData: ICareerMarketData;
  locationDemand: ICareerLocationDemand[];
  exams: ICareerExam[];
  scholarships: ICareerScholarship[];
  alternativeCareers: string[];
  interdisciplinaryTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RequiredSkillSchema = new Schema<ICareerRequiredSkill>(
  {
    skillName: { type: String, required: true, trim: true },
    category: { type: String, enum: ['technical', 'soft', 'domain'], default: 'technical' },
    importance: { type: Number, default: 70, min: 0, max: 100 },
    requiredLevel: { type: Number, required: true, min: 0, max: 100 }
  },
  { _id: false }
);

const AptitudeProfileSchema = new Schema<ICareerAptitudeProfile>(
  {
    logical: { type: Number, required: true, min: 0, max: 100 },
    numerical: { type: Number, required: true, min: 0, max: 100 },
    analytical: { type: Number, required: true, min: 0, max: 100 },
    spatial: { type: Number, required: true, min: 0, max: 100 },
    verbal: { type: Number, required: true, min: 0, max: 100 }
  },
  { _id: false }
);

const InterestMatchSchema = new Schema<ICareerInterestMatch>(
  {
    interest: { type: String, required: true, trim: true },
    importance: { type: Number, default: 80, min: 0, max: 100 }
  },
  { _id: false }
);

const LocationDemandSchema = new Schema<ICareerLocationDemand>(
  {
    location: { type: String, required: true, trim: true },
    demandScore: { type: Number, required: true, min: 0, max: 100 },
    opportunityScore: { type: Number, default: 70, min: 0, max: 100 },
    costIndex: { type: Number, default: 50 }
  },
  { _id: false }
);

const CareerSchema = new Schema<ICareer>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    requiredSkills: [RequiredSkillSchema],
    aptitudeProfile: { type: AptitudeProfileSchema, required: true },
    interestProfile: [InterestMatchSchema],
    educationPathway: {
      minimumDegree: { type: String, required: true },
      preferredDegrees: [{ type: String }],
      typicalDurationYears: { type: Number, default: 4 },
      topColleges: [{ type: String }]
    },
    educationCost: {
      minCost: { type: Number, required: true },
      maxCost: { type: Number, required: true },
      averageCost: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    salaryRange: {
      entryLevel: { type: Number, required: true },
      midLevel: { type: Number, required: true },
      seniorLevel: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    marketData: {
      demandScore: { type: Number, required: true, min: 0, max: 100 },
      growthScore: { type: Number, required: true, min: 0, max: 100 },
      hiringVelocity: { type: Number, default: 70, min: 0, max: 100 },
      stabilityScore: { type: Number, default: 70, min: 0, max: 100 },
      futureOutlook: { type: String }
    },
    locationDemand: [LocationDemandSchema],
    exams: [
      {
        name: { type: String },
        type: { type: String },
        difficulty: { type: String }
      }
    ],
    scholarships: [
      {
        name: { type: String },
        provider: { type: String },
        maxAmount: { type: Number },
        eligibility: { type: String }
      }
    ],
    alternativeCareers: [{ type: String, trim: true }],
    interdisciplinaryTags: [{ type: String, trim: true }]
  },
  {
    timestamps: true
  }
);

CareerSchema.index({ 'locationDemand.location': 1 });

export const Career: Model<ICareer> =
  mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema);

export default Career;
