// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { geminiModel } from "@/src/lib/ai/gemini";
// import { connectDB } from "@/src/lib/db/mongodb";
// import {Resume} from "@/src/lib/db/models/Resume";

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();

//     const {
//       resumeId,
//       interviewType,
//       difficulty,
//       questionCount,
//     } = body;

//     if (!resumeId || !interviewType || !difficulty || !questionCount) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Missing required fields",
//         },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     const resume = await Resume.findOne({
//       _id: resumeId,
//       userId,
//     });

//     if (!resume) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Resume not found",
//         },
//         { status: 404 }
//       );
//     }

//     const prompt = `
// You are an expert technical interviewer.

// Generate ${questionCount} interview questions based on the candidate's resume.

// Interview Type: ${interviewType}
// Difficulty: ${difficulty}

// Resume:
// ${resume.name}

// The questions should:
// - Be relevant to the candidate's skills and experience
// - Match the selected interview type
// - Match the selected difficulty
// - Be realistic interview questions
// - Avoid duplicate questions

// Return ONLY valid JSON in this exact format:

// {
//   "questions": [
//     {
//       "question": "Question text",
//       "category": "Technical",
//       "difficulty": "${difficulty}"
//     }
//   ]
// }
// `;

//     // const result = await geminiModel.generateContent(prompt);
//     const result = await generateWithRetry(prompt);

//     const text = result.response.text();

//     const cleanedText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const interviewData = JSON.parse(cleanedText);

//     return NextResponse.json({
//       success: true,
//       data: interviewData,
//     });
//   } catch (error) {
//     console.error("Interview generation error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to generate interview questions",
//       },
//       { status: 500 }
//     );
//   }
// }



import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  geminiModel,
  geminiFallbackModel,
} from "@/src/lib/ai/gemini";
import { connectDB } from "@/src/lib/db/mongodb";
import { Resume } from "@/src/lib/db/models/Resume";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));


async function generateWithRetry(prompt: string) {
  const models = [geminiModel, geminiFallbackModel];
  const maxAttemptsPerModel = 2;

  for (const model of models) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      try {
        return await model.generateContent(prompt);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

      const isQuotaError =
        /429|RESOURCE_EXHAUSTED|quota|rate limit|rate-limit/i.test(message);

      const isTransientError =
        /\b(408|429|500|502|503|504)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|Service Unavailable/i.test(
          message
        );

      if (isQuotaError) {
        throw new Error(
          "Gemini API quota exceeded. Please wait a while or upgrade your Google AI billing to continue."
        );
      }

      if (!isTransientError) {
        throw error;
      }

      if (attempt === maxAttemptsPerModel) {
        console.warn(
          "Gemini model failed; trying the next model if available."
        );
        break;
      }

      const delay = 1000 * 2 ** (attempt - 1);
      console.warn(`Gemini attempt ${attempt} failed. Retrying in ${delay}ms.`);
      await sleep(delay);
    }
  }
  }

  throw new Error("Interview generation failed on all available Gemini models");
}


export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      resumeId,
      interviewType,
      difficulty,
      questionCount,
    } = body;

    if (!resumeId || !interviewType || !difficulty || !questionCount) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    await connectDB();

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

    const prompt = `
You are an expert technical interviewer.

Generate ${questionCount} interview questions based on the candidate's resume.

Interview Type: ${interviewType}
Difficulty: ${difficulty}

Resume:
${resume.name}

The questions should:
- Be relevant to the candidate's skills and experience
- Match the selected interview type
- Match the selected difficulty
- Be realistic interview questions
- Avoid duplicate questions

Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "question": "Question text",
      "category": "Technical",
      "difficulty": "${difficulty}"
    }
  ]
}
`;

    const result = await generateWithRetry(prompt);

    const text = result.response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const interviewData = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      data: interviewData,
    });
  } catch (error) {
    console.error("Interview generation error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate interview questions";

    const isQuotaError =
      /429|RESOURCE_EXHAUSTED|quota|rate limit|rate-limit/i.test(message);

    return NextResponse.json(
      {
        success: false,
        message: isQuotaError
          ? "Gemini API quota exceeded. Please wait a bit or upgrade your Google AI billing to continue."
          : message,
      },
      { status: isQuotaError ? 429 : 500 }
    );
  }
}

