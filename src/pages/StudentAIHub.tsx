import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { sendChatMessage, conductMockInterview } from "@/lib/ai";
import { Loader2 } from "lucide-react";

export default function StudentAIHub() {
  const [chat, setChat] = useState<string>("");
  const [interviewActive, setInterviewActive] = useState(false);
  const [messages, setMessages] = useState<Array<{ who: "you" | "ai"; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const sendChat = async () => {
    if (!chat.trim() || loading) return;
    const userMsg = chat;
    setMessages(prev => [...prev, { who: "you", text: userMsg }]);
    setChat("");
    setLoading(true);

    if (interviewActive && currentQuestion) {
      // Interview mode
      const result = await conductMockInterview(currentQuestion, userMsg);
      setMessages(prev => [...prev, { who: "ai", text: `Feedback: ${result.feedback}` }, { who: "ai", text: `Next Question: ${result.nextQuestion}` }]);
      setCurrentQuestion(result.nextQuestion);
    } else {
      // Chatbot mode
      const response = await sendChatMessage(userMsg, "internship guidance");
      setMessages(prev => [...prev, { who: "ai", text: response }]);
    }
    setLoading(false);
  };

  const startMockInterview = () => {
    setInterviewActive(true);
    const q = "Tell me about a challenging project you worked on.";
    setCurrentQuestion(q);
    setMessages(prev => [...prev, { who: "ai", text: `[Interview Bot] ${q}` }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">AI Hub</h1>
          <p className="text-muted-foreground">Chatbot Guidance and Interview Bot</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Chatbot</CardTitle>
              <CardDescription>Ask questions about internships, resumes, or interviews.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-56 overflow-auto border border-border rounded p-2 text-sm">
                {messages.map((m, i) => (
                  <div key={i} className={m.who === 'ai' ? 'text-primary' : ''}>
                    <b>{m.who === 'ai' ? 'AI' : 'You'}:</b> {m.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea rows={2} value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Type your question..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }} />
                <Button onClick={sendChat} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Interview Bot</CardTitle>
              <CardDescription>Start a mock interview session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!interviewActive ? (
                <Button onClick={startMockInterview}>Start Interview</Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Interview in progress. Answer the questions above in the chat. (Placeholder)
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
