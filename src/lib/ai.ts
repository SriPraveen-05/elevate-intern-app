// Enhanced AI Integration with LangGraph-style pipeline and retrieval system
// This is a client-side integration for demo purposes
// For production, use a backend proxy to protect API keys

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Knowledge base for retrieval-based responses
const KNOWLEDGE_BASE = {
  companies: [
    {
      name: "Google",
      description: "A multinational technology company specializing in Internet-related services and products.",
      culture: "Innovative, collaborative, data-driven culture with emphasis on user experience",
      interviewProcess: "Technical interviews, coding challenges, system design, behavioral questions",
      benefits: "Competitive salary, stock options, health insurance, free meals, gym access",
      skills: ["Python", "Java", "C++", "Machine Learning", "Cloud Computing", "Data Structures"]
    },
    {
      name: "Microsoft",
      description: "Technology corporation that develops, manufactures, licenses, supports and sells computer software.",
      culture: "Growth mindset, inclusive, customer-focused with emphasis on innovation",
      interviewProcess: "Technical rounds, system design, coding challenges, behavioral interviews",
      benefits: "Health insurance, retirement plans, professional development, flexible work",
      skills: ["C#", ".NET", "Azure", "JavaScript", "SQL", "Cloud Architecture"]
    },
    {
      name: "Amazon",
      description: "Multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.",
      culture: "Customer-obsessed, innovative, high-performance culture with leadership principles",
      interviewProcess: "Behavioral questions, technical interviews, system design, coding challenges",
      benefits: "Competitive compensation, stock options, health benefits, career development",
      skills: ["Java", "Python", "AWS", "Machine Learning", "Distributed Systems", "Data Analytics"]
    }
  ],
  faqs: [
    {
      question: "How to prepare for technical interviews?",
      answer: "Practice coding problems on platforms like LeetCode, understand data structures and algorithms, review system design concepts, and practice explaining your thought process out loud."
    },
    {
      question: "What should I include in my resume?",
      answer: "Include relevant projects, technical skills, internships, academic achievements, and quantify your impact with specific metrics and results."
    },
    {
      question: "How to network effectively?",
      answer: "Attend industry events, join professional groups, connect on LinkedIn, reach out to alumni, and maintain genuine relationships by offering value to others."
    }
  ],
  skills: [
    {
      name: "React",
      description: "A JavaScript library for building user interfaces",
      resources: ["Official React docs", "React tutorials", "Build projects"],
      difficulty: "Intermediate"
    },
    {
      name: "Python",
      description: "A high-level programming language known for its simplicity",
      resources: ["Python.org tutorial", "Codecademy Python", "Practice problems"],
      difficulty: "Beginner"
    }
  ]
};

// LangGraph-style pipeline for AI responses
class AIPipeline {
  private context: string;
  private userProfile: any;

  constructor(context: string = "internship guidance", userProfile?: any) {
    this.context = context;
    this.userProfile = userProfile;
  }

  async processMessage(userMessage: string): Promise<string> {
    // Step 1: Intent Classification
    const intent = await this.classifyIntent(userMessage);
    
    // Step 2: Context Retrieval
    const relevantContext = await this.retrieveContext(userMessage, intent);
    
    // Step 3: Response Generation
    const response = await this.generateResponse(userMessage, relevantContext, intent);
    
    return response;
  }

  private async classifyIntent(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('company') || lowerMessage.includes('google') || lowerMessage.includes('microsoft') || lowerMessage.includes('amazon')) {
      return 'company_info';
    } else if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
      return 'interview_prep';
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return 'resume_help';
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      return 'skill_development';
    } else {
      return 'general_guidance';
    }
  }

  private async retrieveContext(message: string, intent: string): Promise<any> {
    switch (intent) {
      case 'company_info':
        return this.retrieveCompanyInfo(message);
      case 'interview_prep':
        return this.retrieveInterviewInfo();
      case 'resume_help':
        return this.retrieveResumeInfo();
      case 'skill_development':
        return this.retrieveSkillInfo(message);
      default:
        return this.retrieveGeneralInfo();
    }
  }

  private retrieveCompanyInfo(message: string): any {
    const companyName = this.extractCompanyName(message);
    const company = KNOWLEDGE_BASE.companies.find(c => 
      c.name.toLowerCase().includes(companyName.toLowerCase()) || 
      companyName.toLowerCase().includes(c.name.toLowerCase())
    );
    return company || KNOWLEDGE_BASE.companies[0];
  }

  private extractCompanyName(message: string): string {
    const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Netflix'];
    for (const company of companies) {
      if (message.toLowerCase().includes(company.toLowerCase())) {
        return company;
      }
    }
    return 'Google'; // Default
  }

  private retrieveInterviewInfo(): any {
    return {
      process: "Technical interviews typically include coding challenges, system design questions, and behavioral interviews.",
      tips: [
        "Practice coding problems daily",
        "Review data structures and algorithms",
        "Prepare STAR method for behavioral questions",
        "Research the company and role"
      ]
    };
  }

  private retrieveResumeInfo(): any {
    return {
      sections: ["Contact Info", "Education", "Experience", "Projects", "Skills"],
      tips: [
        "Use action verbs and quantify achievements",
        "Keep it concise (1-2 pages)",
        "Tailor for each application",
        "Include relevant keywords"
      ]
    };
  }

  private retrieveSkillInfo(message: string): any {
    const skillName = this.extractSkillName(message);
    return KNOWLEDGE_BASE.skills.find(s => 
      s.name.toLowerCase().includes(skillName.toLowerCase())
    ) || KNOWLEDGE_BASE.skills[0];
  }

  private extractSkillName(message: string): string {
    const skills = ['React', 'Python', 'JavaScript', 'Java', 'C++', 'Machine Learning'];
    for (const skill of skills) {
      if (message.toLowerCase().includes(skill.toLowerCase())) {
        return skill;
      }
    }
    return 'React'; // Default
  }

  private retrieveGeneralInfo(): any {
    return {
      faqs: KNOWLEDGE_BASE.faqs,
      generalTips: [
        "Start building projects early",
        "Network with professionals",
        "Practice coding regularly",
        "Stay updated with industry trends"
      ]
    };
  }

  private async generateResponse(message: string, context: any, intent: string): Promise<string> {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
      return this.generateDemoResponse(intent, context);
  }

  try {
      const systemPrompt = this.buildSystemPrompt(intent, context);
      
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 300,
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
      return this.generateDemoResponse(intent, context);
    }
  }

  private buildSystemPrompt(intent: string, context: any): string {
    const basePrompt = "You are an AI assistant helping students with internship guidance. Provide helpful, actionable advice.";
    
    switch (intent) {
      case 'company_info':
        return `${basePrompt} Use this company information: ${JSON.stringify(context)}. Provide specific details about the company culture, interview process, and benefits.`;
      case 'interview_prep':
        return `${basePrompt} Focus on interview preparation tips and strategies.`;
      case 'resume_help':
        return `${basePrompt} Provide resume writing advice and best practices.`;
      case 'skill_development':
        return `${basePrompt} Focus on skill development and learning resources.`;
      default:
        return basePrompt;
    }
  }

  private generateDemoResponse(intent: string, context: any): string {
    switch (intent) {
      case 'company_info':
        return `[Demo Mode] ${context.name} is a great company to work for! They have a strong culture focused on ${context.culture}. Their interview process typically includes ${context.interviewProcess}. Benefits include ${context.benefits}.`;
      case 'interview_prep':
        return "[Demo Mode] For interview preparation: 1) Practice coding problems daily 2) Review data structures and algorithms 3) Prepare behavioral questions using STAR method 4) Research the company thoroughly.";
      case 'resume_help':
        return "[Demo Mode] For a strong resume: Include relevant projects, quantify achievements, use action verbs, keep it concise (1-2 pages), and tailor it for each application.";
      case 'skill_development':
        return `[Demo Mode] To learn ${context.name}: ${context.description}. Start with ${context.resources.join(', ')}. This is ${context.difficulty} level.`;
      default:
        return "[Demo Mode] I'm here to help with your internship journey! Ask me about companies, interview prep, resume tips, or skill development.";
    }
  }
}

// Enhanced AI functions with LangGraph-style pipeline
export async function sendChatMessage(userMessage: string, context: string = "internship guidance"): Promise<string> {
  const pipeline = new AIPipeline(context);
  return await pipeline.processMessage(userMessage);
}

export async function conductMockInterview(question: string, studentAnswer: string): Promise<{ feedback: string; nextQuestion: string; score: number }> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
    return {
      feedback: "[Demo Mode] Your answer shows promise. Consider providing more specific examples and quantifying your impact.",
      nextQuestion: "Tell me about a time you worked in a team and faced a conflict. How did you resolve it?",
      score: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
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
            content: "You are conducting a mock technical/behavioral interview. Evaluate the candidate's answer and provide: 1) Brief feedback (2-3 sentences) 2) Next question 3) Score (0-100). Format: FEEDBACK: [feedback] NEXT: [question] SCORE: [number]"
          },
          {
            role: "user",
            content: `Question: ${question}\nCandidate Answer: ${studentAnswer}\n\nProvide feedback, next question, and score.`
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse structured response
    const feedbackMatch = content.match(/FEEDBACK:\s*(.+?)(?=NEXT:|$)/s);
    const nextMatch = content.match(/NEXT:\s*(.+?)(?=SCORE:|$)/s);
    const scoreMatch = content.match(/SCORE:\s*(\d+)/);

    return {
      feedback: feedbackMatch?.[1]?.trim() || "Good answer, keep it up!",
      nextQuestion: nextMatch?.[1]?.trim() || "Can you describe a challenging project you worked on?",
      score: parseInt(scoreMatch?.[1] || "75")
    };
  } catch (error) {
    console.error("AI Interview error:", error);
    return {
      feedback: "[Error] Could not process interview.",
      nextQuestion: "Let's continue with another question.",
      score: 0
    };
  }
}

// New function for company-specific information retrieval
export async function getCompanyInfo(companyName: string): Promise<any> {
  const pipeline = new AIPipeline("company_research");
  // Access the knowledge base directly since retrieveCompanyInfo is private
  const companies = KNOWLEDGE_BASE.companies;
  return companies.find(c => 
    c.name.toLowerCase().includes(companyName.toLowerCase()) || 
    companyName.toLowerCase().includes(c.name.toLowerCase())
  ) || companies[0];
}

// New function for skill-based recommendations
export async function getSkillRecommendations(userSkills: string[]): Promise<any[]> {
  const pipeline = new AIPipeline("skill_development");
  return KNOWLEDGE_BASE.skills.filter(skill => 
    !userSkills.some(userSkill => 
      skill.name.toLowerCase().includes(userSkill.toLowerCase())
    )
  );
}
