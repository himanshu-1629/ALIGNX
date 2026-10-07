import mongoose, { Schema, Document, Model } from 'mongoose';

export type MilestoneCategory =
  | 'skill'
  | 'project'
  | 'course'
  | 'exam'
  | 'certification'
  | 'internship'
  | 'education';

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';

export interface IMilestoneResource {
  title: string;
  type: 'course' | 'book' | 'documentation' | 'project' | 'video';
  url?: string;
}

export interface IRoadmapMilestone {
  phase: number;
  sequence: number;
  title: string;
  description?: string;
  category: MilestoneCategory;
  skillsCovered: string[];
  recommendedResources: IMilestoneResource[];
  estimatedDuration?: string;
  status: MilestoneStatus;
}

export interface IRoadmap extends Document {
  studentId: mongoose.Types.ObjectId;
  careerId: mongoose.Types.ObjectId;
  careerName: string;
  title: string;
  description?: string;
  targetRole: string;
  milestones: IRoadmapMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneResourceSchema = new Schema<IMilestoneResource>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['course', 'book', 'documentation', 'project', 'video'],
      default: 'course'
    },
    url: { type: String }
  },
  { _id: false }
);

const RoadmapMilestoneSchema = new Schema<IRoadmapMilestone>(
  {
    phase: { type: Number, required: true },
    sequence: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['skill', 'project', 'course', 'exam', 'certification', 'internship', 'education'],
      default: 'skill'
    },
    skillsCovered: [{ type: String }],
    recommendedResources: [MilestoneResourceSchema],
    estimatedDuration: { type: String },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    }
  },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>(
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
    careerName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    targetRole: { type: String, required: true },
    milestones: [RoadmapMilestoneSchema]
  },
  {
    timestamps: true
  }
);

RoadmapSchema.index({ studentId: 1, careerId: 1 });

export const Roadmap: Model<IRoadmap> =
  mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
