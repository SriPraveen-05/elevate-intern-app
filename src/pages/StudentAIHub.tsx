import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { sendChatMessage, conductMockInterview, getCompanyInfo, getSkillRecommendations } from "@/lib/ai";
import { Loader2, MessageCircle, Mic, Building2, BookOpen, TrendingUp, Star } from "lucide-react";

export default function StudentAIHub() {
  const [chat, setChat] = useState<string>("");
  const [interviewActive, setInterviewActive] = useState(false);
  const [messages, setMessages] = useState<Array<{ who: "you" | "ai"; text: string; timestamp: Date }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [skillRecommendations, setSkillRecommendations] = useState<any[]>([]);

  const sendChat = async () => {
    if (!chat.trim() || loading) return;
    const userMsg = chat;
    setMessages(prev => [...prev, { who: "you", text: userMsg, timestamp: new Date() }]);
    setChat("");
    setLoading(true);

    try {
      if (interviewActive && currentQuestion) {
        // Interview mode
        const result = await conductMockInterview(currentQuestion, userMsg);
        setMessages(prev => [...prev, 
          { who: "ai", text: `Feedback: ${result.feedback}`, timestamp: new Date() },
          { who: "ai", text: `Next Question: ${result.nextQuestion}`, timestamp: new Date() }
        ]);
        setCurrentQuestion(result.nextQuestion);
        setInterviewScore(result.score);
      } else {
        // Chatbot mode
        const response = await sendChatMessage(userMsg, "internship guidance");
        setMessages(prev => [...prev, { who: "ai", text: response, timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { who: "ai", text: "Sorry, I encountered an error. Please try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const startMockInterview = () => {
    setInterviewActive(true);
    setInterviewScore(null);
    const q = "Tell me about a challenging project you worked on.";
    setCurrentQuestion(q);
    setMessages(prev => [...prev, { who: "ai", text: `[Interview Bot] ${q}`, timestamp: new Date() }]);
  };

  const endInterview = () => {
    setInterviewActive(false);
    setCurrentQuestion("");
    setMessages(prev => [...prev, { who: "ai", text: "Interview session ended. Great job!", timestamp: new Date() }]);
  };

  const loadCompanyInfo = async (companyName: string) => {
    try {
      const info = await getCompanyInfo(companyName);
      setCompanyInfo(info);
    } catch (error) {
      console.error("Error loading company info:", error);
    }
  };

  const loadSkillRecommendations = async () => {
    try {
      const skills = await getSkillRecommendations(["React", "JavaScript"]);
      setSkillRecommendations(skills);
    } catch (error) {
      console.error("Error loading skill recommendations:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">AI Hub</h1>
          <p className="text-muted-foreground">Enhanced AI-powered guidance with LangGraph pipeline</p>
        </div>

        <Tabs defaultValue="chatbot" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
            <TabsTrigger value="interview">Mock Interview</TabsTrigger>
            <TabsTrigger value="companies">Company Info</TabsTrigger>
            <TabsTrigger value="skills">Skill Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI InfoBot
                </CardTitle>
                <CardDescription>Retrieval-based chatbot with company details, FAQs, and prep guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-80 overflow-auto border border-border rounded p-4 text-sm space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation! Ask about companies, interview prep, resume tips, or skill development.</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.who === 'you' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        m.who === 'ai' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        <div className="font-medium text-xs mb-1">
                          {m.who === 'ai' ? 'AI Assistant' : 'You'} • {m.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="whitespace-pre-wrap">{m.text}</div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea 
                    rows={2} 
                    value={chat} 
                    onChange={(e) => setChat(e.target.value)} 
                    placeholder="Ask about companies, interviews, resume tips, or skills..." 
                    onKeyDown={(e) => { 
                      if (e.key === 'Enter' && !e.shiftKey) { 
                        e.preventDefault(); 
                        sendChat(); 
                      } 
                    }} 
                  />
                  <Button onClick={sendChat} disabled={loading || !chat.trim()}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  MockAI Interview Bot
                </CardTitle>
                <CardDescription>AI interviewer with LangGraph pipeline and prompt-based evaluation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {interviewScore !== null && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Interview Score: {interviewScore}/100</span>
                    </div>
                    <Progress value={interviewScore} className="h-2" />
                  </div>
                )}
                
                <div className="h-64 overflow-auto border border-border rounded p-4 text-sm space-y-3">
                  {messages.filter(m => m.text.includes('[Interview Bot]') || m.text.includes('Feedback:') || m.text.includes('Next Question:')).map((m, i) => (
                    <div key={i} className={`flex ${m.who === 'you' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        m.who === 'ai' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        <div className="whitespace-pre-wrap">{m.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {!interviewActive ? (
                    <Button onClick={startMockInterview} className="flex-1">
                      <Mic className="h-4 w-4 mr-2" />
                      Start Mock Interview
                    </Button>
                  ) : (
                    <>
                      <Textarea 
                        rows={2} 
                        value={chat} 
                        onChange={(e) => setChat(e.target.value)} 
                        placeholder="Type your answer..." 
                        onKeyDown={(e) => { 
                          if (e.key === 'Enter' && !e.shiftKey) { 
                            e.preventDefault(); 
                            sendChat(); 
                          } 
                        }} 
                        className="flex-1"
                      />
                      <Button onClick={sendChat} disabled={loading || !chat.trim()}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                      </Button>
                      <Button variant="outline" onClick={endInterview}>
                        End Interview
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription>Get detailed information about companies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={() => loadCompanyInfo("Google")} variant="outline">Google</Button>
                  <Button onClick={() => loadCompanyInfo("Microsoft")} variant="outline">Microsoft</Button>
                  <Button onClick={() => loadCompanyInfo("Amazon")} variant="outline">Amazon</Button>
                </div>
                
                {companyInfo && (
                  <div className="p-4 border border-border rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg">{companyInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">{companyInfo.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Culture</h4>
                      <p className="text-sm">{companyInfo.culture}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Interview Process</h4>
                      <p className="text-sm">{companyInfo.interviewProcess}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Benefits</h4>
                      <p className="text-sm">{companyInfo.benefits}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {companyInfo.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Skill Recommendations
                </CardTitle>
                <CardDescription>AI-recommended learning materials based on internship requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={loadSkillRecommendations} variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Load Recommendations
                </Button>
                
                {skillRecommendations.length > 0 && (
                  <div className="space-y-3">
                    {skillRecommendations.map((skill, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{skill.name}</h3>
                          <Badge variant="outline">{skill.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Resources:</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {skill.resources.map((resource: string, idx: number) => (
                              <li key={idx}>{resource}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
