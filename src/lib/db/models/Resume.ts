import mongoose, { Schema, type Document } from "mongoose";

export interface IResume extends Document {
  userId: string;
  name: string;
  url: string;
  uploadedAt: Date;
  extractedText: string;
}
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
  },
  {
    timestamps: true,
  }
);

export const Resume =
  mongoose.models.Resume ||
  mongoose.model<IResume>("Resume", resumeSchema);

