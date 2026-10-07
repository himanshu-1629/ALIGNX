import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentInterest {
  name: string;
  score: number;
  category?: string;
}

export interface IStudentSkill {
  skillId?: mongoose.Types.ObjectId;
  name: string;
  proficiency: number; // 0 - 100
  category?: 'technical' | 'soft' | 'domain';
  source?: 'student_input' | 'assessment' | 'imported';
}

export interface ICareerDna {
  primaryTrait: string; // e.g. "Analytical Builder"
  secondaryTraits: string[];
  traitScores: {
    analytical: number;
    builder: number;
    research: number;
    creative: number;
    leadership: number;
    social: number;
    risk: number;
  };
  summary?: string;
}

export interface IAptitudeSnapshot {
  logical: number;
  numerical: number;
  analytical: number;
  spatial: number;
  verbal: number;
  completedAt?: Date;
}

export interface IStudent extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  age?: number;
  educationLevel: string; // e.g. '12th Grade', 'B.Tech', etc.
  currentYear?: number | string;
  branch?: string;
  location: string;
  interests: IStudentInterest[];
  skills: IStudentSkill[];
  goals: string[];
  careerDna?: ICareerDna;
  aptitudeSnapshot?: IAptitudeSnapshot;
  familyId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudentInterestSchema = new Schema<IStudentInterest>(
  {
    name: { type: String, required: true, trim: true },
    score: { type: Number, default: 50, min: 0, max: 100 },
    category: { type: String, trim: true }
  },
  { _id: false }
);

const StudentSkillSchema = new Schema<IStudentSkill>(
  {
    skillId: { type: Schema.Types.ObjectId },
    name: { type: String, required: true, trim: true },
    proficiency: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, enum: ['technical', 'soft', 'domain'], default: 'technical' },
    source: { type: String, enum: ['student_input', 'assessment', 'imported'], default: 'student_input' }
  },
  { _id: false }
);

const CareerDnaSchema = new Schema<ICareerDna>(
  {
    primaryTrait: { type: String, required: true },
    secondaryTraits: [{ type: String }],
    traitScores: {
      analytical: { type: Number, default: 0, min: 0, max: 100 },
      builder: { type: Number, default: 0, min: 0, max: 100 },
      research: { type: Number, default: 0, min: 0, max: 100 },
      creative: { type: Number, default: 0, min: 0, max: 100 },
      leadership: { type: Number, default: 0, min: 0, max: 100 },
      social: { type: Number, default: 0, min: 0, max: 100 },
      risk: { type: Number, default: 0, min: 0, max: 100 }
    },
    summary: { type: String }
  },
  { _id: false }
);

const AptitudeSnapshotSchema = new Schema<IAptitudeSnapshot>(
  {
    logical: { type: Number, required: true, min: 0, max: 100 },
    numerical: { type: Number, required: true, min: 0, max: 100 },
    analytical: { type: Number, required: true, min: 0, max: 100 },
    spatial: { type: Number, required: true, min: 0, max: 100 },
    verbal: { type: Number, required: true, min: 0, max: 100 },
    completedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    age: { type: Number, min: 10, max: 100 },
    educationLevel: { type: String, required: true, trim: true },
    currentYear: { type: Schema.Types.Mixed },
    branch: { type: String, trim: true },
    location: { type: String, required: true, trim: true, index: true },
    interests: [StudentInterestSchema],
    skills: [StudentSkillSchema],
    goals: [{ type: String, trim: true }],
    careerDna: { type: CareerDnaSchema },
    aptitudeSnapshot: { type: AptitudeSnapshotSchema },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family' }
  },
  {
    timestamps: true
  }
);


export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
