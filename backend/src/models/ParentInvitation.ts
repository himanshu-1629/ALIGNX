import mongoose, { Schema, Document, Model } from 'mongoose';

export type InvitationStatus = 'pending' | 'used' | 'expired';

export interface IParentInvitation extends Document {
  studentId: mongoose.Types.ObjectId;
  familyId: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  token: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ParentInvitationSchema = new Schema<IParentInvitation>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      required: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    usedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'used', 'expired'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// TTL or query optimization index
ParentInvitationSchema.index({ tokenHash: 1, expiresAt: 1 });

export const ParentInvitation: Model<IParentInvitation> =
  mongoose.models.ParentInvitation ||
  mongoose.model<IParentInvitation>('ParentInvitation', ParentInvitationSchema);

export default ParentInvitation;
