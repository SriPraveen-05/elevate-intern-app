import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMentoringSessions } from "@/hooks/useData";
import { Award, Calendar, Users } from "lucide-react";

export default function AlumniPortal() {
  const { data: sessions = [] } = useMentoringSessions();
  const mySessions = sessions;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Alumni Mentor Portal</h1>
          <p className="text-muted-foreground">Guide juniors and share your experience</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{mySessions.length}</div>
                  <div className="text-sm text-muted-foreground">Mentoring Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">
                    {mySessions.filter(s => s.status === "requested").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">⭐⭐⭐⭐⭐</div>
                  <div className="text-sm text-muted-foreground">Mentor Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Mentoring Requests</CardTitle>
            <CardDescription>Students seeking guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mySessions.filter(s => s.status === "requested").length === 0 && (
              <p className="text-muted-foreground text-center py-4">No pending requests</p>
            )}
            {mySessions.filter(s => s.status === "requested").map((session) => (
              <div key={session.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{session.studentName}</div>
                  <div className="text-sm text-muted-foreground">
                    Requested: {new Date(session.time).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Accept</Button>
                  <Button size="sm" variant="outline">Decline</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mySessions.filter(s => s.status === "completed").map((session) => (
              <div key={session.id} className="p-2 border-l-4 border-primary pl-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{session.studentName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(session.time).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
              </div>
            ))}
            {mySessions.filter(s => s.status === "completed").length === 0 && (
              <p className="text-muted-foreground text-center py-4">No completed sessions yet</p>
            )}
          </CardContent>
        </Card>

        {/* Tips for Mentors */}
        <Card>
          <CardHeader>
            <CardTitle>Mentoring Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              <div>Share your internship experiences and lessons learned</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              <div>Help students with resume reviews and interview prep</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              <div>Provide honest feedback on their readiness and skills</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              <div>Connect students with opportunities in your network</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
