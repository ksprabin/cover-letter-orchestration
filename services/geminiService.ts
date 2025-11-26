import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JobExtraction, ARTIFACT_URLS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const EXTRACTION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    company: { type: Type.STRING, description: "The name of the hiring company." },
    requirements: {
      type: Type.ARRAY,
      description: "A list of the top 5 most critical skills, tools, or requirements for the job.",
      items: { type: Type.STRING }
    }
  },
  required: ["company", "requirements"]
};

export const extractJobDetails = async (jobDescription: string): Promise<JobExtraction> => {
  const userQuery = `Analyze the job description below. Identify the hiring company name and list the 5 most critical, specific skills or requirements for this role.
            
  --- JOB DESCRIPTION ---
  ${jobDescription}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userQuery,
    config: {
      systemInstruction: "You are an efficient data extractor. Your only goal is to parse the input and return a JSON object that strictly conforms to the provided schema. Do not include any external commentary.",
      responseMimeType: "application/json",
      responseSchema: EXTRACTION_SCHEMA
    }
  });

  if (!response.text) {
    throw new Error("Failed to extract data from the job description.");
  }

  return JSON.parse(response.text) as JobExtraction;
};

export const generateCoverLetter = async (extractedData: JobExtraction, userExperience: string): Promise<string> => {
  const { company, requirements } = extractedData;
  const requirementsList = requirements.join(', ');

  const userQuery = `Write a professional cover letter. The letter should be addressed to the hiring manager at "${company}".
  The letter MUST explicitly address how the candidate meets these key requirements: ${requirementsList}.
  The candidate's relevant experience is: ${userExperience}.
  `;

  const systemInstruction = `You are an expert career consultant. Write a persuasive and professional, single-page cover letter in a standard business format, using placeholders for the date and recipient name. Adopt a warm, impact-focused, and collaborative tone.

  FORMATTING RULES FOR READABILITY:
  1. Short Paragraphs: Use concise paragraphs (max 3-4 sentences). Avoid large blocks of dense text.
  2. Bullet Points: You MUST use a bulleted list to highlight key technical skills, achievements, or specific matches to the job requirements. This is essential for readability.
  3. No Markdown Bolding: Do NOT use double asterisks (**) anywhere. Do not bold words. Keep the text clean and plain.

  CONTENT REQUIREMENTS:
  1. Value Focus: Focus entirely on what the candidate can contribute to the company's business.
  2. Addressing Gaps: Identify gaps between the JD and the candidate's profile and frame the candidate's existing expertise as a solution or highly transferable skill.
  3. Artifact Integration: Integrate the following URLs naturally into the letter (e.g., within the bullet points or a relevant paragraph):
     - React Practice: ${ARTIFACT_URLS.REACT_GITHUB_URL}
     - AI App: ${ARTIFACT_URLS.AI_WEB_APP_URL}
     - Portfolio: ${ARTIFACT_URLS.PORTFOLIO_URL}
  4. Mandatory Sentence: You MUST include this exact sentence: "Possessing a rare skill for front-end fidelity, I deliver screens that are visually and functionally identical to the original UX design, guaranteeing a flawless UI."
  5. Performance Nuance: Mention in a subtle, professional manner that while the candidate may consider themselves an average performer during interviews, their actual work performance and delivery are consistently exceptional.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userQuery,
    config: {
      systemInstruction: systemInstruction,
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate the cover letter.");
  }

  return response.text;
};