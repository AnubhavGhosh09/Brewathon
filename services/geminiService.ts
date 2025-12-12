// Mock Service - No external API dependency
// Replaces Google GenAI with simple template logic for offline functionality

export const chatWithSenior = async (
  message: string,
  _history: { role: string; content: string }[]
): Promise<string> => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('attendance')) {
      return "Listen kid, 85% is the magic number. Anything less and you're begging the HOD. Check your survival metrics.";
  }
  if (lowerMsg.includes('food') || lowerMsg.includes('canteen')) {
      return "Gobi Manchurian. That's it. That's the food pyramid here. Canteen A has better chai though.";
  }
  if (lowerMsg.includes('bunk')) {
      return "You can bunk if your attendance is > 90%. Otherwise, sit down and study. Don't be a hero.";
  }
  if (lowerMsg.includes('exam') || lowerMsg.includes('test')) {
      return "Start studying 2 nights before. Use the library. And get the previous year question papers from the Xerox shop.";
  }
  if (lowerMsg.includes('club') || lowerMsg.includes('join')) {
      return "Join technical clubs for skills, cultural clubs for vibes. Don't join everything or you'll burn out.";
  }

  return "I'm just a simulated senior (Offline Mode), but I'd say: focus on your labs and make good friends. That's the real survival guide.";
};

export const parseTimetableImage = async (_base64Image: string): Promise<string> => {
   // Simulate delay
   await new Promise(resolve => setTimeout(resolve, 1500));
   
   return JSON.stringify([
      {
        day: "Monday",
        slots: [
             { time: "09:00", subject: "Math (Scanned)", type: "Lecture", room: "LH-1" },
             { time: "11:00", subject: "Physics (Scanned)", type: "Lecture", room: "LH-2" },
             { time: "14:00", subject: "C-Lab", type: "Lab", room: "LAB-1" }
        ]
      },
      {
        day: "Tuesday",
        slots: [
             { time: "09:00", subject: "Electronics", type: "Lecture", room: "LH-3" },
             { time: "11:00", subject: "English", type: "Lecture", room: "LH-1" }
        ]
      }
   ]);
};

// Direct Generation Functions to avoid parsing errors
export const generateExcuse = async (reason: string, intensity: number): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (intensity > 80) {
        return `I couldn't submit the assignment on "${reason}" because a cosmic ray flipped a bit in my hard drive, corrupting specifically that folder. I need 24 hours to reconstruct the data manually.`;
    } else if (intensity < 30) {
         return `I apologize for the delay regarding ${reason}. I had a sudden family medical emergency that required my immediate attention.`;
    } else {
        return `I couldn't attend because of ${reason}. My laptop initiated a mandatory BIOS update right when I was about to start, and it took 3 hours to complete.`;
    }
};

export const generateDraftEmail = async (recipient: string, topic: string, tone: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const subjectLine = topic.length > 40 ? topic.substring(0, 40) + "..." : topic;
    
    let opening = "I hope this email finds you well.";
    let bodyIntro = `I am writing to respectfully inform you about: ${topic}.`;
    let closing = "Thank you for your time and consideration.";

    if (tone === 'Apologetic') {
        opening = "I am writing to you with sincere apologies.";
        bodyIntro = `I regret to inform you about the following situation: ${topic}. I understand this is not ideal.`;
        closing = "I appreciate your understanding in this matter.";
    } else if (tone === 'Urgent') {
        opening = "I am writing to bring an urgent matter to your attention.";
        bodyIntro = `The situation is as follows: ${topic}. This requires immediate action.`;
        closing = "I look forward to your prompt response.";
    } else if (tone === 'Desperate') {
        opening = "I am writing to you in a difficult situation.";
        bodyIntro = `I am really struggling with ${topic} and I am hoping you can help me out.`;
        closing = "Please consider my request, it would mean a lot.";
    }

    return `Subject: ${tone === 'Urgent' ? 'URGENT: ' : ''}Regarding ${subjectLine}

Dear ${recipient},

${opening}

${bodyIntro}

Given the circumstances, I would be extremely grateful if you could consider my case. I am committed to catching up on any missed work immediately.

${closing}

Sincerely,
[Your Name]
Roll No: [Your ID]
Department of Engineering`;
};

// Legacy wrapper for compatibility
export const generateAIResponse = async (prompt: string, _systemInstruction: string): Promise<string> => {
  if (prompt.startsWith('Generate an excuse for:')) {
      const reasonMatch = prompt.match(/Generate an excuse for: ([\s\S]*?)\. Believability/);
      const reason = reasonMatch ? reasonMatch[1] : "unforeseen circumstances";
      const intensityMatch = prompt.match(/Believability level: (\d+)%/);
      const intensity = intensityMatch ? parseInt(intensityMatch[1]) : 50;
      return generateExcuse(reason, intensity);
  }

  if (prompt.startsWith('Write an email to')) {
      const recipientMatch = prompt.match(/Write an email to ([\s\S]*?) about:/);
      const topicMatch = prompt.match(/about: ([\s\S]*?)\. Tone:/);
      const toneMatch = prompt.match(/Tone: (.*?)\./);

      const recipient = recipientMatch ? recipientMatch[1] : "Professor";
      const topic = topicMatch ? topicMatch[1] : "Subject Matter";
      const tone = toneMatch ? toneMatch[1] : "Professional";
      
      return generateDraftEmail(recipient, topic, tone);
  }

  return "AI Module Offline. Please input specific parameters.";
};
