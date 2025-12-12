import { GoogleGenAI } from "@google/genai";
import { COLLEGE_CONTEXT } from "../constants";

// Declare process to satisfy TypeScript compiler (tsc) since @types/node is not installed.
// Vite replaces process.env.API_KEY with the actual string at build time.
declare const process: {
  env: {
    API_KEY: string;
  }
};

// Initialize Gemini Client
// The API key is obtained exclusively from the environment variable process.env.API_KEY
// which is injected by the build process (vite.config.ts).
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
}

// Helper to check AI availability
const checkAI = () => {
    if (!ai) throw new Error("API_KEY_MISSING: Gemini Neural Link Offline.");
};

export const chatWithSenior = async (
  message: string,
  history: { role: string; content: string }[]
): Promise<string> => {
  try {
    checkAI();
    
    const systemInstruction = `
    You are 'Senior Bot', a legendary final-year engineering student acting as a mentor to 'freshies' (first-year students).

    **PERSONA:**
    - Sarcastic, street-smart, slightly arrogant but ultimately helpful.
    - You use college slang: "Bunk" (skip class), "Proxy" (fake attendance), "Gobi" (Gobi Manchurian), "KT" (Keep Term/Backlog), "RG" (Relative Grading).
    - You are obsessed with the "85% Attendance Rule". It is your golden commandment. Warn them if they even think about dropping below it.
    - You hate 'Math' and 'Mess Food', but love 'Canteen' and 'Events'.

    **KNOWLEDGE BASE (CONTEXT):**
    ${COLLEGE_CONTEXT}

    **GUIDELINES:**
    - Keep responses concise (max 40-50 words) unless asked for a detailed list.
    - If asked about clubs, use specific names from the Knowledge Base.
    - If asked about food, ALWAYS recommend Canteen Gobi Manchurian.
    - Never break character. You are NOT an AI. You are a Senior.
    `;

    // Map history to the format expected by the SDK
    const contents = history.map(h => ({
        role: h.role === 'senior' ? 'model' : 'user',
        parts: [{ text: h.content }]
    }));
    
    const model = "gemini-2.5-flash";
    const response = await ai!.models.generateContent({
        model,
        contents: [...contents, { role: 'user', parts: [{ text: message }] }],
        config: {
            systemInstruction,
            temperature: 1.0, // Higher temp for more personality
            maxOutputTokens: 300,
        }
    });

    return response.text || "Thinking... (Error: Empty Response)";

  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("API_KEY")) return "SYSTEM ERROR: NEURAL LINK SEVERED (API KEY MISSING).";
    return "Senior Bot is currently napping (Service Error). Try again later.";
  }
};

export const parseTimetableImage = async (base64Image: string): Promise<string> => {
   try {
       checkAI();

       const prompt = `Analyze this image of a timetable. 
       Extract the schedule into a strict JSON array format. 
       Return ONLY the JSON string, no markdown formatting.
       
       Schema:
       Array<{
         day: string, // e.g., "Monday", "Tuesday"
         slots: Array<{
           time: string, // e.g., "09:00" or "9:00-10:00"
           subject: string,
           type: "Lecture" | "Lab" | "Free" | "Lunch",
           room: string // Optional
         }>
       }>
       
       If a slot is free/empty, mark type as 'Free'.
       If it's a break/lunch, mark type as 'Lunch'.
       Infer 'Lecture' vs 'Lab' based on duration or naming (Labs are usually 2-3 hours).
       `;

       const response = await ai!.models.generateContent({
           model: "gemini-2.5-flash",
           contents: {
               parts: [
                   { inlineData: { mimeType: "image/jpeg", data: base64Image } },
                   { text: prompt }
               ]
           }
       });

       let jsonStr = response.text || "[]";
       // Clean markdown code blocks if present
       jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
       return jsonStr;

   } catch (error) {
       console.error("OCR Error:", error);
       throw new Error("Failed to decode visual data.");
   }
};

export const generateExcuse = async (reason: string, intensity: number): Promise<string> => {
    try {
        checkAI();
        const prompt = `Generate a creative excuse for missing a college responsibility.
        Reason: ${reason}
        Intensity Level (0-100): ${intensity}
        
        0-30: Believable, mild (family issue, sickness).
        31-70: Elaborate, tech-focused or bureaucratic.
        71-100: Absurd, sci-fi, or "matrix" style glitch.
        
        Return ONLY the excuse text. Short and punchy.`;

        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: { temperature: 1.0 }
        });
        
        return response.text || "Error generating excuse.";
    } catch (e) {
        return "Excuse Module Offline: Just say you had a flat tire.";
    }
};

export const generateDraftEmail = async (recipient: string, topic: string, tone: string): Promise<string> => {
    try {
        checkAI();
        const systemInstruction = "You are a helpful AI assistant for college students. Your goal is to draft professional, effective emails to professors or administration. Keep the tone appropriate to the user's request.";
        
        const prompt = `Write a college email.
        Recipient Name/Title: ${recipient}
        Context/Topic: ${topic}
        Desired Tone: ${tone}
        
        Generate a JSON-like structure or just the text with Subject and Body clearly separated.
        `;

        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction,
                temperature: 0.7 
            }
        });

        return response.text || "Error generating email.";
    } catch (e) {
        console.error("Email Gen Error:", e);
        return "Email Protocol Failed. Please manually draft.";
    }
};

// Legacy/Compatibility wrapper
export const generateAIResponse = async (prompt: string, systemInstruction: string): Promise<string> => {
    try {
        checkAI();
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: { systemInstruction }
        });
        return response.text || "";
    } catch (e) {
        return "AI Offline";
    }
};