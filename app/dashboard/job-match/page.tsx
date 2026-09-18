import type { Metadata } from "next";
import JobMatchPage from "@/src/components/job-match/job-match-page";
 
export const metadata: Metadata = {
  title: "Job Match | AI Resume Analyzer",
  description:
    "Compare your resume with a job description using AI. Discover your match score, matching skills, missing skills, keywords, and improvement suggestions.",
};

export default function Page() {
  return <JobMatchPage />;
}