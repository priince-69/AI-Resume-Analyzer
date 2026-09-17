"use client";

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

type ResumeUploadProps = {
  onUploadComplete?: () => void;
};

export default function ResumeUpload({
  onUploadComplete,
}: ResumeUploadProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <UploadButton
        endpoint="resumeUploader"
        onClientUploadComplete={async (res) => {
          try {
            const file = res?.[0];

            if (!file) {
              throw new Error("No uploaded file found");
            }

            console.log("UPLOAD SUCCESS:", file);

            const response = await fetch("/api/resumes", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: file.name,
                url: file.ufsUrl,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || "Failed to save resume"
              );
            }

            console.log("RESUME SAVED:", data);

            // Refresh dashboard resumes
            onUploadComplete?.();

            alert("Resume uploaded and saved successfully!");
          } catch (error) {
            console.error("SAVE RESUME ERROR:", error);

            alert(
              error instanceof Error
                ? error.message
                : "Failed to save resume"
            );
          }
        }}
        onUploadError={(error) => {
          console.error("UPLOAD ERROR:", error);

          alert(`Upload failed: ${error.message}`);
        }}
        onUploadBegin={(name) => {
          console.log("UPLOAD STARTED:", name);
        }}
      />
    </div>
  );
}