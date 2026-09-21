import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db/mongodb";
import { Resume } from "@/src/lib/db/models/Resume";
import { JobMatch } from "@/src/lib/db/models/JobMatch";
import { analyzeJobMatch } from "@/src/lib/ai/ats";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // 2. Read request body
    const body = await request.json();

    const {
      resumeId,
      jobTitle,
      jobDescription,
    } = body;

    // 3. Validate input
    if (!resumeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume ID is required",
        },
        { status: 400 }
      );
    }

    if (
      !jobDescription ||
      typeof jobDescription !== "string" ||
      jobDescription.trim().length < 50
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Job description must contain at least 50 characters",
        },
        { status: 400 }
      );
    }

    // 4. Connect MongoDB
    await connectDB();

    // 5. Find user's resume
    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
    });

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 }
      );
    }

    // 6. Make sure resume text exists
    if (!resume.extractedText?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume text is not available",
        },
        { status: 422 }
      );
    }

    // 7. Analyze resume against job description
    const result = await analyzeJobMatch(
      resume.extractedText,
      jobDescription.trim()
    );

    // 8. Save result to MongoDB
    const jobMatch = await JobMatch.create({
      userId,
      resumeId: resume._id,
      jobTitle: jobTitle?.trim() || "",
      jobDescription: jobDescription.trim(),

      matchScore: result.matchScore,

      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,

      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,

      strengths: result.strengths,
      weaknesses: result.weaknesses,

      suggestions: result.suggestions,
    });

    // 9. Return response
    return NextResponse.json(
      {
        success: true,
        message: "Job description analyzed successfully",
        jobMatch,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("JOB DESCRIPTION ANALYSIS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to analyze job description",
      },
      { status: 500 }
    );
  }
}