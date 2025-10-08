import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";
import { useMentors, useMentoringSessions, useRequestMentoringSession } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MentoringSection = () => {
  const { data: mentors = [] } = useMentors();
  const { user } = useAuth();
  const studentName = user?.name || "Student";
  const { data: sessions = [] } = useMentoringSessions(studentName);
  const requestSession = useRequestMentoringSession();
  const { toast } = useToast();

  const handleRequest = async (mentorId: string) => {
    await requestSession.mutateAsync({ studentName, mentorId, time: new Date().toISOString() });
    toast({ title: "Session Requested", description: "Mentor will confirm soon." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alumni & Faculty Mentoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{mentor.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{mentor.type}</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {mentor.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] px-1 py-0">{tag}</Badge>
                ))}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleRequest(mentor.id)}>Request</Button>
          </div>
        ))}
        {sessions.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Your Sessions ({sessions.length})</div>
            {sessions.slice(0, 2).map((s) => {
              const mentor = mentors.find(m => m.id === s.mentorId);
              return (
                <div key={s.id} className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded mb-1">
                  <span>{mentor?.name || "Mentor"}</span>
                  <Badge variant="secondary" className="text-[10px]">{s.status}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MentoringSection;
