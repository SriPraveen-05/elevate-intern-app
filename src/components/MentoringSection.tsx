import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Video, Calendar } from "lucide-react";

const MentoringSection = () => {
  const mentoringSessions = [
    {
      title: "Alumni Q&A",
      schedule: "Saturdays 5 PM",
      type: "group",
      icon: MessageCircle,
    },
    {
      title: "Mock Interviews",
      schedule: "Book a slot",
      type: "one-on-one",
      icon: Video,
    },
    {
      title: "Career Guidance",
      schedule: "Weekdays 6-8 PM",
      type: "group",
      icon: Calendar,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mentoringSessions.map((session, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <session.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{session.title}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {session.schedule}
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Join
            </Button>
          </div>
        ))}

        {/* Recent Mentoring Activity */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3 text-sm">Recent Sessions</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
              <div>
                <span className="font-medium">Resume Review</span>
                <span className="text-muted-foreground"> with Rahul Kumar</span>
                <div className="text-xs text-muted-foreground">2 days ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
              <div>
                <span className="font-medium">Mock Interview</span>
                <span className="text-muted-foreground"> with Priya Sharma</span>
                <div className="text-xs text-muted-foreground">5 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentoringSection;
