import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  resumeUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("Resume uploaded:", file.ufsUrl);

    return {
      url: file.ufsUrl,
      name: file.name,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;