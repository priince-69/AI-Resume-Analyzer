import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export interface ATSMatchResult {
  matchScore: number;

  matchedSkills: string[];
  missingSkills: string[];

  matchedKeywords: string[];
  missingKeywords: string[];

  strengths: string[];
  weaknesses: string[];

  suggestions: string[];
}

const atsMatchSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.NUMBER,
      description:
        "Overall ATS compatibility score between the resume and job description, from 0 to 100.",
    },

    matchedSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Skills explicitly present in both the resume and the job description.",
    },

    missingSkills: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Important skills required or strongly preferred by the job description that are not demonstrated in the resume.",
    },

    matchedKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Important job-description keywords already represented in the resume.",
    },

    missingKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Important job-description keywords missing from the resume.",
    },

    strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Areas where the resume strongly matches the job description.",
    },

    weaknesses: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Important gaps between the resume and job description.",
    },

    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Practical suggestions to improve the resume for this specific job description.",
    },
  },

  required: [
    "matchScore",
    "matchedSkills",
    "missingSkills",
    "matchedKeywords",
    "missingKeywords",
    "strengths",
    "weaknesses",
    "suggestions",
  ],
};

export async function analyzeJobMatch(
  resumeText: string,
  jobDescription: string
): Promise<ATSMatchResult> {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume text is too short to analyze");
  }

  if (!jobDescription || jobDescription.trim().length < 50) {
    throw new Error("Job description is too short to analyze");
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) specialist and technical recruiter.

Compare the candidate's resume against the provided job description.

IMPORTANT RULES:

1. Do not invent skills, experience, qualifications, projects, or achievements.
2. Only consider information explicitly present in the resume.
3. Only consider requirements and keywords explicitly present or clearly implied by the job description.
4. matchScore must be between 0 and 100.
5. Evaluate technical skills, tools, technologies, responsibilities, qualifications, and relevant keywords.
6. matchedSkills must contain skills demonstrated in the resume that are relevant to the job description.
7. missingSkills must contain important job requirements that are not demonstrated in the resume.
8. matchedKeywords must contain meaningful keywords from the job description that are represented in the resume.
9. missingKeywords must contain meaningful keywords from the job description that are absent from the resume.
10. Do not recommend adding a skill simply because it is popular. Suggestions must be relevant to this specific job.
11. Do not recommend falsely claiming experience or skills.
12. Suggestions should explain how the candidate can improve the resume honestly.
13. Keep the response professional, concise, and useful for job applications.
14. Return only data matching the provided JSON schema.

CANDIDATE RESUME:

${resumeText}

JOB DESCRIPTION:

${jobDescription}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseJsonSchema: atsMatchSchema,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    console.log("GEMINI ATS RAW RESPONSE:", text);

    let result: ATSMatchResult;

    try {
      result = JSON.parse(text);
    } catch (error) {
      console.error("ATS JSON PARSE ERROR:", error);
      console.error("GEMINI ATS RESPONSE:", text);

      throw new Error("Gemini returned invalid ATS JSON");
    }

    // Validate match score

    if (
      typeof result.matchScore !== "number" ||
      result.matchScore < 0 ||
      result.matchScore > 100
    ) {
      throw new Error("Invalid matchScore returned by Gemini");
    }

    // Validate arrays

    if (!Array.isArray(result.matchedSkills)) {
      throw new Error("Invalid matchedSkills returned by Gemini");
    }

    if (!Array.isArray(result.missingSkills)) {
      throw new Error("Invalid missingSkills returned by Gemini");
    }

    if (!Array.isArray(result.matchedKeywords)) {
      throw new Error("Invalid matchedKeywords returned by Gemini");
    }

    if (!Array.isArray(result.missingKeywords)) {
      throw new Error("Invalid missingKeywords returned by Gemini");
    }

    if (!Array.isArray(result.strengths)) {
      throw new Error("Invalid strengths returned by Gemini");
    }

    if (!Array.isArray(result.weaknesses)) {
      throw new Error("Invalid weaknesses returned by Gemini");
    }

    if (!Array.isArray(result.suggestions)) {
      throw new Error("Invalid suggestions returned by Gemini");
    }

    return result;
  } catch (error) {
    console.error("GEMINI ATS ANALYSIS ERROR:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to analyze resume against job description");
  }
}