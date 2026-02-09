import { GoogleGenAI } from "@google/genai";

// This service is prepared for real integration.
// Since we are building a prototype without a guaranteed API key input flow in the UI,
// we will primarily use mock data, but this structure demonstrates readiness.

const apiKey = process.env.API_KEY || ''; // In a real app, this would come from env or secure storage

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateMatchAnalysis = async (productTitle: string, creatorName: string) => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock response.");
    return null;
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Analyze the compatibility between product "${productTitle}" and creator "${creatorName}" for a TikTok promotion. Return JSON with matchScore (0-100) and reason.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
