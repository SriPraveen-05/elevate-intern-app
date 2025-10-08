// AI Integration helper for Chatbot and Interview Bot
// This is a client-side integration for demo purposes
// For production, use a backend proxy to protect API keys

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function sendChatMessage(userMessage: string, context: string = "internship guidance"): Promise<string> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
    return "[Demo Mode] AI response placeholder. Add VITE_OPENAI_API_KEY to .env to enable real AI.";
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for students seeking ${context}. Provide concise, actionable advice.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error("AI API error:", error);
    return "[Error] Could not reach AI service. Please check your API key and connection.";
  }
}

export async function conductMockInterview(question: string, studentAnswer: string): Promise<{ feedback: string; nextQuestion: string }> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
    return {
      feedback: "[Demo Mode] Your answer shows promise. Consider providing more specific examples.",
      nextQuestion: "Tell me about a time you worked in a team and faced a conflict. How did you resolve it?"
    };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are conducting a mock technical/behavioral interview for an internship candidate. Provide brief feedback on their answer and ask a follow-up question."
          },
          {
            role: "user",
            content: `Question: ${question}\nCandidate Answer: ${studentAnswer}\n\nProvide: 1) Brief feedback 2) Next question`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Simple parsing (in production, use structured output)
    const parts = content.split("\n");
    const feedback = parts.slice(0, Math.ceil(parts.length / 2)).join(" ");
    const nextQuestion = parts.slice(Math.ceil(parts.length / 2)).join(" ");

    return {
      feedback: feedback || "Good answer.",
      nextQuestion: nextQuestion || "Can you describe a challenging project you worked on?"
    };
  } catch (error) {
    console.error("AI Interview error:", error);
    return {
      feedback: "[Error] Could not process interview.",
      nextQuestion: "Let's continue with another question."
    };
  }
}
