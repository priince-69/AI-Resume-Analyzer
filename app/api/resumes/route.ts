import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db/mongodb";
import { Resume } from "@/src/lib/db/models/Resume";
import { extractPdfText } from "@/src/lib/pdf/extract-text";

export const runtime = "nodejs";

// GET - Fetch logged-in user's resumes
export async function GET() {
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

    await connectDB();

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("GET RESUMES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch resumes",
      },
      { status: 500 }
    );
  }
}

// POST - Save uploaded resume and extract PDF text
export async function POST(request: Request) {
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

    const body = await request.json();

    const { name, url } = body;

    // Validate request body
    if (!name || !url) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume name and URL are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Extract text from uploaded PDF
    console.log(`Extracting text from resume: ${name}`);

    const extractedText = await extractPdfText(url);

    if (!extractedText.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Could not extract text from this PDF. Please upload a text-based PDF.",
        },
        { status: 422 }
      );
    }

    console.log(
      `PDF text extracted successfully. Characters: ${extractedText.length}`
    );

    // Save resume and extracted text
    const resume = await Resume.create({
      userId,
      name,
      url,
      extractedText,
    });

    console.log(`Resume saved successfully: ${resume._id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Resume saved successfully",
        resume,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST RESUME ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save resume",
      },
      { status: 500 }
    );
  }
}