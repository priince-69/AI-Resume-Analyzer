import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db/mongodb";
import { Resume } from "@/src/lib/db/models/Resume";

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
    console.error("Resume fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch resumes",
      },
      { status: 500 }
    );
  }
}

// POST - Save uploaded resume
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

    const resume = await Resume.create({
      userId,
      name,
      url,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resume saved successfully",
        resume,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Resume save error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save resume",
      },
      { status: 500 }
    );
  }
}