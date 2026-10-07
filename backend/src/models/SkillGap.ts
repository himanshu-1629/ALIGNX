import mongoose, { Schema, Document, Model } from 'mongoose';

export type SkillGapPriority = 'high' | 'medium' | 'low';

export interface ISingleSkillGap {
  skillName: string;
  category: 'technical' | 'soft' | 'domain';
  currentLevel: number; // 0 - 100
  requiredLevel: number; // 0 - 100
  gap: number; // requiredLevel - currentLevel (max(0, ...))
  priority: SkillGapPriority;
}

export interface ISkillGapAnalysis extends Document {
  studentId: mongoose.Types.ObjectId;
  careerId: mongoose.Types.ObjectId;
  careerSlug: string;
  careerName: string;
  gaps: ISingleSkillGap[];
  priorityGaps: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SingleSkillGapSchema = new Schema<ISingleSkillGap>(
  {
    skillName: { type: String, required: true, trim: true },
    category: { type: String, enum: ['technical', 'soft', 'domain'], default: 'technical' },
    currentLevel: { type: Number, required: true, min: 0, max: 100 },
    requiredLevel: { type: Number, required: true, min: 0, max: 100 },
    gap: { type: Number, required: true, min: 0, max: 100 },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
  },
  { _id: false }
);

const SkillGapSchema = new Schema<ISkillGapAnalysis>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    careerId: {
      type: Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
      index: true
    },
    careerSlug: { type: String, required: true },
    careerName: { type: String, required: true },
    gaps: [SingleSkillGapSchema],
    priorityGaps: [{ type: String }]
  },
  {
    timestamps: true
  }
);

SkillGapSchema.index({ studentId: 1, careerId: 1 }, { unique: true });

export const SkillGap: Model<ISkillGapAnalysis> =
  mongoose.models.SkillGap || mongoose.model<ISkillGapAnalysis>('SkillGap', SkillGapSchema);

export default SkillGap;
