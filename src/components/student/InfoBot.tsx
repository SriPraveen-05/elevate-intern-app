import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, X, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isLoading?: boolean;
};

const SUGGESTED_QUESTIONS = [
  "How can I prepare for a technical interview?",
  "What are the top skills for a software engineering intern?",
  "How do I write a good cover letter?",
  "What should I include in my internship portfolio?",
];

export default function InfoBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: `Hi${user?.name ? ` ${user.name}` : ''}! I'm your InfoBot assistant. How can I help you with your internship journey today?`,
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, user?.name]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
    };

    // Add loading message
    const loadingMessageId = `loading-${Date.now()}`;
    const loadingMessage: Message = {
      id: loadingMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call
      const response = await fetchInfoBotResponse(messageContent);
      
      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessageId 
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error fetching response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from InfoBot. Please try again.',
        variant: 'destructive',
      });
      
      // Remove loading message on error
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated API call - replace with actual API integration
  const fetchInfoBotResponse = async (query: string): Promise<string> => {
    // In a real implementation, this would call your backend API
    return new Promise(resolve => {
      setTimeout(() => {
        const responses: Record<string, string> = {
          'hello': 'Hello! How can I assist you with your internship journey today?',
          'how to prepare for interview': 'To prepare for an interview, research the company, practice common questions, review your resume, and prepare questions to ask the interviewer.',
          'what are my upcoming deadlines': 'I can help you find that! Let me check your calendar and deadlines...',
          'help': 'I can help with interview preparation, company insights, internship applications, and more. What would you like to know?',
        };
        
        const defaultResponse = "I'm here to help with your internship journey. You can ask me about interview preparation, company insights, application tips, and more. What would you like to know?";
        
        const queryLower = query.toLowerCase();
        const matchedKey = Object.keys(responses).find(key => 
          queryLower.includes(key.toLowerCase())
        );
        
        resolve(matchedKey ? responses[matchedKey] : defaultResponse);
      }, 1000); // Simulate network delay
    });
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    // Auto-submit after a short delay to allow the input to update
    setTimeout(() => {
      handleSendMessage(question);
    }, 100);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="https://mockhire.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full h-14 w-14 p-0 shadow-lg relative bg-primary text-white hover:bg-primary/90 transition-colors"
          title="Go to Mock Interview"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
            <Sparkles className="h-3 w-3" />
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col h-[500px] z-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-1 rounded-full">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">InfoBot Assistant</h3>
            <p className="text-xs opacity-80">AI Internship Assistant</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div 
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted rounded-bl-none',
                message.isLoading && 'flex items-center space-x-2'
              )}
            >
              {message.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        
        {messages.length === 1 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-muted-foreground text-center">
              Try asking me about:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTED_QUESTIONS.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-3 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about internships..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
