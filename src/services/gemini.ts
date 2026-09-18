import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeResume(resumeText: string) {
  const prompt = `
You are an expert technical recruiter and resume analyst.

Analyze the following resume professionally.

Return ONLY valid JSON.

The JSON must follow this exact structure:

{
  "overallScore": number,
  "summary": "string",
  "skills": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingKeywords": ["string"],
  "suggestions": ["string"],
  "experienceLevel": "string",
  "jobReadiness": "string"
}

Rules:

- overallScore must be between 0 and 100.
- Be realistic and objective.
- Do not invent skills or experience.
- Identify important technical and soft skills.
- Identify weaknesses in the resume.
- Identify useful missing keywords.
- Give practical suggestions.
- Determine the candidate's approximate experience level.
- Determine job readiness.
- Return JSON only.
- Do not wrap the JSON in markdown.

Resume:

${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
}