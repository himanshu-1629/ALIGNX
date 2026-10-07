import mongoose, { Schema, Document, Model } from 'mongoose';

export type AssessmentType = 'career_discovery' | 'aptitude';
export type AssessmentStatus = 'started' | 'completed' | 'abandoned';

export interface IAssessmentResponse {
  questionId: string;
  questionText?: string;
  selectedOption: string | number | Record<string, any>;
  dimensionImpact?: Record<string, number>;
  answeredAt?: Date;
}

export interface IAssessment extends Document {
  studentId: mongoose.Types.ObjectId;
  assessmentType: AssessmentType;
  status: AssessmentStatus;
  startedAt: Date;
  completedAt?: Date;
  responses: IAssessmentResponse[];
  calculatedScores?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentResponseSchema = new Schema<IAssessmentResponse>(
  {
    questionId: { type: String, required: true },
    questionText: { type: String },
    selectedOption: { type: Schema.Types.Mixed, required: true },
    dimensionImpact: { type: Map, of: Number },
    answeredAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    assessmentType: {
      type: String,
      enum: ['career_discovery', 'aptitude'],
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['started', 'completed', 'abandoned'],
      default: 'started',
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    responses: [AssessmentResponseSchema],
    calculatedScores: {
      type: Map,
      of: Number
    }
  },
  {
    timestamps: true
  }
);

AssessmentSchema.index({ studentId: 1, assessmentType: 1 });

export const Assessment: Model<IAssessment> =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;
