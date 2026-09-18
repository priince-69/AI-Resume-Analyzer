import mongoose, { Schema, type Document } from "mongoose";

export interface IResumeAnalysis {
  overallScore: number;
  skills: string[];
  experience: string[];
  education: string[];
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface IResume extends Document {
  userId: string;
  name: string;
  url: string;
  uploadedAt: Date;
  extractedText: string;
  analysis?: IResumeAnalysis;
}

const analysisSchema = new Schema<IResumeAnalysis>(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: [String],
      default: [],
    },

    education: {
      type: [String],
      default: [],
    },

    keywords: {
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

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    extractedText: {
      type: String,
      default: "",
    },

    analysis: {
      type: analysisSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume =
  mongoose.models.Resume ||
  mongoose.model<IResume>("Resume", resumeSchema);