import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudentProfile } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Trophy, MessageSquare, BarChart2, Calendar, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// Import child components (we'll create these next)
import InternshipRecommendations from "./InternshipRecommendations";
import UpcomingDeadlines from "./UpcomingDeadlines";
import CreditsEarned from "./CreditsEarned";
import LearningTracker from "./LearningTracker";
import InfoBot from "./InfoBot";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useStudentProfile(user?.id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Student'}</h1>
          <p className="text-muted-foreground">
            Track your internship journey and enhance your skills
          </p>
        </div>
        <Button onClick={() => navigate('/ai')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask InfoBot
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart2 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="internships">
            <Briefcase className="mr-2 h-4 w-4" />
            Internships
          </TabsTrigger>
          <TabsTrigger value="learning">
            <BookOpen className="mr-2 h-4 w-4" />
            Learning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.credits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.creditsToNextLevel ? `${profile.creditsToNextLevel} to next level` : 'Keep it up!'}
                </p>
                {profile?.creditsToNextLevel && (
                  <Progress value={(profile.credits / (profile.credits + profile.creditsToNextLevel)) * 100} className="h-2 mt-2" />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.activeInternships || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.pendingApplications ? `${profile.pendingApplications} pending` : 'No pending applications'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills in Progress</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.skillsInProgress?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.skillsInProgress?.length ? 'Keep learning!' : 'Add some skills to track'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.upcomingDeadlines?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.upcomingDeadlines?.length ? 'Check deadlines tab' : 'No upcoming deadlines'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recommended Internships</CardTitle>
              </CardHeader>
              <CardContent>
                <InternshipRecommendations />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <LearningTracker />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="internships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Internships</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingDeadlines />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CreditsEarned />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse recommended learning resources based on your profile and internship goals.
                </p>
                <Button variant="outline" className="mt-4">
                  View Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* InfoBot Chat Widget - Fixed position at bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <InfoBot />
      </div>
    </div>
  );
}
