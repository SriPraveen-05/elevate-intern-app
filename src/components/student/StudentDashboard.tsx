import { useState } from "react";
import { format } from "date-fns";
import { Clock, Plus, Briefcase, Trophy, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import InternshipRecommendations from "./InternshipRecommendations";
import UpcomingDeadlines from "./UpcomingDeadlines";
import CreditsEarned from "./CreditsEarned";
import LearningTracker from "./LearningTracker";
import LogbookViewer from "./LogbookViewer";
import CreditTransferEligibility from "./CreditTransferEligibility";
import InfoBot from "./InfoBot";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddDeadline, setShowAddDeadline] = useState(false);

  // Mock data for demonstration
  const profile = {
    name: user?.name || "Student",
    credits: 15,
    creditsToNextLevel: 5
  };

  const deadlines = [
    { 
      id: '1', 
      title: 'Project Submission', 
      dueDate: '2023-12-01', 
      type: 'project', 
      priority: 'high', 
      completed: false, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex-grow">Welcome back, {profile.name}!</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Credits Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.credits}</div>
            <p className="text-xs text-muted-foreground">
              {profile.creditsToNextLevel} to next level
            </p>
            <Progress 
              value={(profile.credits / (profile.credits + profile.creditsToNextLevel)) * 100} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>

        {/* Active Internships Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No active internships</p>
          </CardContent>
        </Card>

        {/* Skills in Progress Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills in Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">JavaScript, React, Node.js</p>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowAddDeadline(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {deadlines.length > 0 ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">{deadlines.length}</div>
                <p className="text-xs text-muted-foreground">
                  Next: {format(new Date(deadlines[0].dueDate), 'MMM d, yyyy')} - {deadlines[0].title}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Removed duplicate code and unnecessary components */}
    </div>
  );
}
