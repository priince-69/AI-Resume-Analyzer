import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db/mongodb";
import { Resume } from "@/src/lib/db/models/Resume";
import { Analysis } from "@/src/lib/db/models/Analysis";
import { analyzeResume } from "@/src/services/gemini";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Fetch existing analysis
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
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

    const { id } = await context.params;

    await connectDB();

    const analysis = await Analysis.findOne({
      _id: id,
      userId,
    }).lean();

    if (!analysis) {
      return NextResponse.json(
        {
          success: false,
          message: "Analysis not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("GET ANALYSIS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch analysis",
      },
      { status: 500 }
    );
  }
}

// POST - Analyze resume
export async function POST(
  _request: Request,
  context: RouteContext
) {
  try {
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

    const { id } = await context.params;

    await connectDB();

    const resume = await Resume.findOne({
      _id: id,
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

    if (!resume.extractedText?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume text is not available",
        },
        { status: 422 }
      );
    }

    // Return existing analysis instead of calling Gemini again
    const existingAnalysis = await Analysis.findOne({
      resumeId: resume._id,
      userId,
    }).lean();

    if (existingAnalysis) {
      return NextResponse.json({
        success: true,
        message: "Analysis already exists",
        analysis: existingAnalysis,
      });
    }

    // Analyze with Gemini
    const result = await analyzeResume(
      resume.extractedText
    );

    // Save analysis
    const analysis = await Analysis.create({
      userId,
      resumeId: resume._id,
      overallScore: result.overallScore,
      summary: result.summary,
      skills: result.skills,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      missingKeywords: result.missingKeywords,
      suggestions: result.suggestions,
      experienceLevel: result.experienceLevel,
      jobReadiness: result.jobReadiness,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resume analyzed successfully",
        analysis,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RESUME ANALYSIS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to analyze resume",
      },
      { status: 500 }
    );
  }
}