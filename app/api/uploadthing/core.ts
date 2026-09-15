import { currentUser } from "@clerk/nextjs/server";
import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  resumeUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await currentUser();

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resume uploaded by:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      return {
        userId: metadata.userId,
        url: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;