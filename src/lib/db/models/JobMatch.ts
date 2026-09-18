import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IJobMatch extends Document {
  userId: string;
  resumeId: mongoose.Types.ObjectId;

  jobTitle?: string;
  jobDescription: string;

  matchScore: number;

  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];

  strengths: string[];
  weaknesses: string[];
  suggestions: string[];

  createdAt: Date;
  updatedAt: Date;
}

const jobMatchSchema = new Schema<IJobMatch>(
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

    jobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
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
    timestamps: true,
  }
);

const JobMatch: Model<IJobMatch> =
  mongoose.models.JobMatch ||
  mongoose.model<IJobMatch>("JobMatch", jobMatchSchema);

export { JobMatch };

export default JobMatch;