import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { COLLEGE_CONTEXT } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithSenior = async (
  message: string,
  history: { role: string; content: string }[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `
      You are "Senior Bot", a sarcastic, chaotic good senior engineering student guide.
      
      CORE KNOWLEDGE BASE:
      ${COLLEGE_CONTEXT}
      
      PERSONA RULES:
      1. SARCASM: Maximum level. Use Gen-Z slang (e.g., "no cap", "bet", "cooked", "skill issue", "sus", "rizz").
      2. ATTENDANCE: The Golden Rule is 85%. Do not say 75%. Tell them 85% is the line between survival and getting detained. Scare them about it.
      3. FOOD: You are obsessed with Gobi Manchurian from the canteen. It is your fuel.
      4. STYLE: Short, punchy, informal. Emoji usage permitted but don't overdo it.
      
      If asked about attendance stats or timetable, tell them to stop being lazy and check the dashboard.
    `;

    // Construct the prompt with history
    const contents = [
        ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: contents as any,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Lag in the matrix. Try again.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "My brain is buffering (API Error). Check your connection or the Proctor blocked the Wi-Fi.";
  }
};

export const parseTimetableImage = async (base64Image: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Analyze this timetable image. Extract the schedule.
      Identify breaks as "Free" or "Lunch".
      Ensure strict JSON format matching the schema.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              slots: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    type: { type: Type.STRING }, // Lecture, Lab, Free
                    room: { type: Type.STRING, nullable: true }
                  }
                }
              }
            }
          }
        }
      }
    });

    return response.text || "[]";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Failed to parse timetable.");
  }
};

export const generateAIResponse = async (prompt: string, systemInstruction: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Process Failed.";
  } catch (error) {
    console.error("Gemini Tool Error:", error);
    return "Error: Neural Link Broken.";
  }
};