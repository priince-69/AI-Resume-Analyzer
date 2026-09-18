import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export interface ResumeAnalysisResult {
  overallScore: number;
  summary: string;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
  experienceLevel: string;
  jobReadiness: string;
}

const resumeAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: "Resume score from 0 to 100.",
    },

    summary: {
      type: Type.STRING,
      description: "Professional summary of the resume.",
    },

    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Technical and soft skills actually present in the resume.",
    },

    strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Main strengths of the candidate.",
    },

    weaknesses: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Important weaknesses or gaps in the resume.",
    },

    missingKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Useful keywords that could improve the resume.",
    },

    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Practical recommendations for improving the resume.",
    },

    experienceLevel: {
      type: Type.STRING,
      description:
        "Approximate experience level such as Fresher, Entry Level, Junior, Mid Level, or Senior.",
    },

    jobReadiness: {
      type: Type.STRING,
      description:
        "Overall job readiness assessment based only on the resume.",
    },
  },

  required: [
    "overallScore",
    "summary",
    "skills",
    "strengths",
    "weaknesses",
    "missingKeywords",
    "suggestions",
    "experienceLevel",
    "jobReadiness",
  ],
};

export async function analyzeResume(
  resumeText: string
): Promise<ResumeAnalysisResult> {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume text is too short to analyze");
  }

  const prompt = `
You are an expert technical recruiter and professional resume analyst.

Analyze the resume below objectively.

RULES:

1. Do not invent skills, experience, education, projects, or achievements.
2. Only identify skills that are actually present in the resume.
3. overallScore must be between 0 and 100.
4. Identify technical and soft skills.
5. Identify realistic strengths.
6. Identify realistic weaknesses.
7. Identify useful missing keywords based on the candidate's existing profile.
8. Give practical suggestions that the candidate can actually implement.
9. Determine the approximate experience level.
10. Determine job readiness.
11. Keep the analysis professional and concise.
12. Return data matching the provided JSON schema.

RESUME:

${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseJsonSchema: resumeAnalysisSchema,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    console.log("GEMINI RAW RESPONSE:", text);

    let result: ResumeAnalysisResult;

    try {
      result = JSON.parse(text);
    } catch (error) {
      console.error("JSON PARSE ERROR:", error);
      console.error("GEMINI RESPONSE:", text);

      throw new Error("Gemini returned invalid JSON");
    }

    // Validate the important fields before saving to MongoDB.

    if (
      typeof result.overallScore !== "number" ||
      result.overallScore < 0 ||
      result.overallScore > 100
    ) {
      throw new Error("Invalid overallScore returned by Gemini");
    }

    if (typeof result.summary !== "string") {
      throw new Error("Invalid summary returned by Gemini");
    }

    if (!Array.isArray(result.skills)) {
      throw new Error("Invalid skills returned by Gemini");
    }

    if (!Array.isArray(result.strengths)) {
      throw new Error("Invalid strengths returned by Gemini");
    }

    if (!Array.isArray(result.weaknesses)) {
      throw new Error("Invalid weaknesses returned by Gemini");
    }

    if (!Array.isArray(result.missingKeywords)) {
      throw new Error("Invalid missingKeywords returned by Gemini");
    }

    if (!Array.isArray(result.suggestions)) {
      throw new Error("Invalid suggestions returned by Gemini");
    }

    if (typeof result.experienceLevel !== "string") {
      throw new Error("Invalid experienceLevel returned by Gemini");
    }

    if (typeof result.jobReadiness !== "string") {
      throw new Error("Invalid jobReadiness returned by Gemini");
    }

    return result;
  } catch (error) {
    console.error("GEMINI ANALYSIS ERROR:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to analyze resume with Gemini");
  }
}