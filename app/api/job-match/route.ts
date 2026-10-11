import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db/mongodb";
 
import { Resume } from "@/src/lib/db/models/Resume";
import { JobMatch } from "@/src/lib/db/models/JobMatch";
import { analyzeJobMatch } from "@/src/lib/ai/ats";

export const runtime = "nodejs";

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
      jobTitle = "",
      jobDescription,
    } = body;

    // 3. Validate input
    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume ID and job description are required",
        },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Job description must contain at least 50 characters",
        },
        { status: 400 }
      );
    }

    // 4. Connect to MongoDB
    await connectDB();

    // 5. Find resume belonging to logged-in user
    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
    }).lean();

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 }
      );
    }

    // 6. Make sure extracted text exists
    if (!resume.extractedText || resume.extractedText.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Resume text is unavailable. Please upload the resume again.",
        },
        { status: 422 }
      );
    }

    console.log(
      `Starting ATS analysis for resume: ${resume._id}`
    );

    // 7. Analyze resume against job description
    const result = await analyzeJobMatch(
      resume.extractedText,
      jobDescription
    );

    console.log(
      `ATS analysis completed. Match score: ${result.matchScore}`
    );

    // 8. Save result to MongoDB
    const jobMatch = await JobMatch.create({
      userId,
      resumeId: resume._id,

      jobTitle: jobTitle.trim(),

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

    console.log(
      `ATS analysis saved successfully: ${jobMatch._id}`
    );

    // 9. Return result
    return NextResponse.json(
      {
        success: true,
        message: "Job match analysis completed successfully",
        jobMatch,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("JOB MATCH API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze resume against job description",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    // 2. Connect to MongoDB
    await connectDB();

    // 3. Fetch user's job match history
    const jobMatches = await JobMatch.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // 4. Return history
    return NextResponse.json(
      {
        success: true,
        message: "Job match history fetched successfully",
        jobMatches,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("JOB MATCH HISTORY API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch job match history",
      },
      { status: 500 }
    );
  }
}