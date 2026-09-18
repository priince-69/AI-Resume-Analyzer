import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalysis extends Document {
  userId: string;
  resumeId: mongoose.Types.ObjectId;

  overallScore: number;

  summary: string;

  skills: string[];

  strengths: string[];

  weaknesses: string[];

  missingKeywords: string[];

  suggestions: string[];

  experienceLevel: string;

  jobReadiness: string;

  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    experienceLevel: {
      type: String,
      default: "Unknown",
    },

    jobReadiness: {
      type: String,
      default: "Needs Improvement",
    },
  },
  {
    timestamps: true,
  }
);

export const Analysis: Model<IAnalysis> =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>("Analysis", AnalysisSchema);