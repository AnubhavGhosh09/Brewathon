// Mock Service - No external API dependency

export const chatWithSenior = async (
  message: string,
  _history: { role: string; content: string }[]
): Promise<string> => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('attendance')) {
      return "Listen kid, 85% is the magic number. Anything less and you're begging the HOD. Check your survival metrics.";
  }
  if (lowerMsg.includes('food') || lowerMsg.includes('canteen')) {
      return "Gobi Manchurian. That's it. That's the food pyramid here.";
  }
  if (lowerMsg.includes('bunk')) {
      return "You can bunk if your attendance is > 90%. Otherwise, sit down and study.";
  }

  return "I'm currently running in offline mode (API Disconnected). But seriously, focus on your labs.";
};

export const parseTimetableImage = async (_base64Image: string): Promise<string> => {
   // Simulate delay
   await new Promise(resolve => setTimeout(resolve, 1500));
   
   // Return a dummy valid JSON structure so the app doesn't crash
   // In a real scenario without AI, this would need OCR or manual entry
   return JSON.stringify([
      {
        day: "Monday",
        slots: [
             { time: "09:00", subject: "Math (Scanned)", type: "Lecture", room: "LH-1" },
             { time: "11:00", subject: "Physics (Scanned)", type: "Lecture", room: "LH-2" }
        ]
      }
   ]);
};

export const generateAIResponse = async (prompt: string, _systemInstruction: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (prompt.includes('excuse')) {
      return "I can't attend class because my laptop initiated a BIOS update that will take exactly 57 minutes.";
  }
  if (prompt.includes('email')) {
      return "Dear Professor,\n\nI am writing to humbly request... [Offline Mode: Template Generated]";
  }

  return "AI Module Offline. Please reconnect neural link.";
};