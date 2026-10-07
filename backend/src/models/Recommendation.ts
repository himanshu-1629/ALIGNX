import mongoose, { Schema, Document, Model } from 'mongoose';

export type AffordabilityCategory =
  | 'Financially Feasible'
  | 'Feasible With Scholarship'
  | 'Stretch Option'
  | 'Currently Unsuitable';

export interface IScoreComponents {
  studentFit: number; // 0 - 100
  financialFit: number; // 0 - 100
  familyAlignment: number; // 0 - 100
  marketFit: number; // 0 - 100
  locationFit: number; // 0 - 100
}

export interface IRecommendationExplanation {
  whyItMatches: string[];
  potentialChallenges: string[];
  suggestedAlternatives: string[];
  summary?: string;
}

export interface IRankedCareerResult {
  careerId?: mongoose.Types.ObjectId;
  careerSlug: string;
  careerName: string;
  rank: number;
  overallScore: number; // 0 - 100
  components: IScoreComponents;
  affordabilityStatus: AffordabilityCategory;
  explanationData?: IRecommendationExplanation;
}

export interface IRecommendationWeights {
  studentFit: number; // default 0.35
  financialFit: number; // default 0.20
  familyAlignment: number; // default 0.15
  marketFit: number; // default 0.20
  locationFit: number; // default 0.10
}

export interface IRecommendation extends Document {
  studentId: mongoose.Types.ObjectId;
  engineVersion: string;
  status: 'generated' | 'outdated' | 'failed';
  weightsUsed: IRecommendationWeights;
  rankedCareers: IRankedCareerResult[];
  createdAt: Date;
  updatedAt: Date;
}

const ScoreComponentsSchema = new Schema<IScoreComponents>(
  {
    studentFit: { type: Number, required: true, min: 0, max: 100 },
    financialFit: { type: Number, required: true, min: 0, max: 100 },
    familyAlignment: { type: Number, required: true, min: 0, max: 100 },
    marketFit: { type: Number, required: true, min: 0, max: 100 },
    locationFit: { type: Number, required: true, min: 0, max: 100 }
  },
  { _id: false }
);

const RecommendationExplanationSchema = new Schema<IRecommendationExplanation>(
  {
    whyItMatches: [{ type: String }],
    potentialChallenges: [{ type: String }],
    suggestedAlternatives: [{ type: String }],
    summary: { type: String }
  },
  { _id: false }
);

const RankedCareerResultSchema = new Schema<IRankedCareerResult>(
  {
    careerId: { type: Schema.Types.ObjectId, ref: 'Career' },
    careerSlug: { type: String, required: true },
    careerName: { type: String, required: true },
    rank: { type: Number, required: true, min: 1 },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    components: { type: ScoreComponentsSchema, required: true },
    affordabilityStatus: {
      type: String,
      enum: [
        'Financially Feasible',
        'Feasible With Scholarship',
        'Stretch Option',
        'Currently Unsuitable'
      ],
      default: 'Financially Feasible'
    },
    explanationData: { type: RecommendationExplanationSchema }
  },
  { _id: false }
);

const RecommendationSchema = new Schema<IRecommendation>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    engineVersion: {
      type: String,
      default: '1.0'
    },
    status: {
      type: String,
      enum: ['generated', 'outdated', 'failed'],
      default: 'generated',
      index: true
    },
    weightsUsed: {
      studentFit: { type: Number, default: 0.35 },
      financialFit: { type: Number, default: 0.20 },
      familyAlignment: { type: Number, default: 0.15 },
      marketFit: { type: Number, default: 0.20 },
      locationFit: { type: Number, default: 0.10 }
    },
    rankedCareers: [RankedCareerResultSchema]
  },
  {
    timestamps: true
  }
);

RecommendationSchema.index({ studentId: 1, createdAt: -1 });

export const Recommendation: Model<IRecommendation> =
  mongoose.models.Recommendation ||
  mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);

export default Recommendation;
