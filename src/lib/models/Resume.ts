import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IResume extends Document {
  userId: string;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  extractedText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileKey: {
      type: String,
      required: true,
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

const Resume: Model<IResume> =
  mongoose.models.Resume ||
  mongoose.model<IResume>("Resume", resumeSchema);

export { Resume };

export default Resume;