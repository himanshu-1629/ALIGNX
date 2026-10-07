import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWhatIfInputs {
  educationBudget?: number;
  location?: string;
  riskAppetite?: 'low' | 'medium' | 'high';
  timeToEmployment?: string;
  additionalSkills?: string[];
}

export interface IWhatIfCareerRankResult {
  careerName: string;
  careerSlug: string;
  overallScore: number;
  rank: number;
  scoreDelta?: number; // Simulated minus original
  rankDelta?: number; // Position shift (+/-)
}

export interface IWhatIfResults {
  originalRankings: IWhatIfCareerRankResult[];
  simulatedRankings: IWhatIfCareerRankResult[];
  keyShifts: string[];
}

export interface IWhatIfScenario extends Document {
  studentId: mongoose.Types.ObjectId;
  scenarioName?: string;
  inputs: IWhatIfInputs;
  results: IWhatIfResults;
  createdAt: Date;
  updatedAt: Date;
}

const WhatIfCareerRankResultSchema = new Schema<IWhatIfCareerRankResult>(
  {
    careerName: { type: String, required: true },
    careerSlug: { type: String, required: true },
    overallScore: { type: Number, required: true },
    rank: { type: Number, required: true },
    scoreDelta: { type: Number, default: 0 },
    rankDelta: { type: Number, default: 0 }
  },
  { _id: false }
);

const WhatIfScenarioSchema = new Schema<IWhatIfScenario>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    scenarioName: { type: String, default: 'Custom Simulation' },
    inputs: {
      educationBudget: { type: Number },
      location: { type: String },
      riskAppetite: { type: String, enum: ['low', 'medium', 'high'] },
      timeToEmployment: { type: String },
      additionalSkills: [{ type: String }]
    },
    results: {
      originalRankings: [WhatIfCareerRankResultSchema],
      simulatedRankings: [WhatIfCareerRankResultSchema],
      keyShifts: [{ type: String }]
    }
  },
  {
    timestamps: true
  }
);

WhatIfScenarioSchema.index({ studentId: 1, createdAt: -1 });

export const WhatIfScenario: Model<IWhatIfScenario> =
  mongoose.models.WhatIfScenario ||
  mongoose.model<IWhatIfScenario>('WhatIfScenario', WhatIfScenarioSchema);

export default WhatIfScenario;
