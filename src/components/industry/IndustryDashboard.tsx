import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Users, BarChart2, Target, FileText, Calendar, MessageSquare, Settings, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useIndustryProfile } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";

export default function IndustryDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useIndustryProfile(user?.id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.companyName || 'Company'}</h1>
          <p className="text-muted-foreground">
            Manage your internships and connect with top talent
          </p>
        </div>
        <Button onClick={() => navigate('/postings/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Internship
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
          <TabsTrigger value="applicants">
            <Users className="mr-2 h-4 w-4" />
            Applicants
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.totalApplicants || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.newApplicants ? `${profile.newApplicants} new this week` : 'No new applicants'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.hireRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.hireRateChange ? `+${profile.hireRateChange}% from last year` : 'No change'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.upcomingEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.nextEvent ? `Next: ${profile.nextEvent}` : 'No upcoming events'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center p-4 border rounded-lg">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Frontend Developer Intern</p>
                        <p className="text-sm text-muted-foreground">Applied 2 days ago</p>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        New
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Skills in Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'React', percentage: 85 },
                    { name: 'Node.js', percentage: 72 },
                    { name: 'Python', percentage: 68 },
                    { name: 'UI/UX Design', percentage: 61 },
                    { name: 'Data Analysis', percentage: 55 },
                  ].map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.percentage}%</span>
                      </div>
                      <Progress value={skill.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="internships">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Internship Postings</CardTitle>
                <Button size="sm" onClick={() => navigate('/postings/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Posting
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Software Engineering Intern</p>
                      <p className="text-sm text-muted-foreground">
                        {['Summer 2024', 'Fall 2024', 'Winter 2024'][i % 3]} • {['Remote', 'Hybrid', 'On-site'][i % 3]}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {['Open', 'Closed', 'Draft'][i % 3]}
                      </Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {['JD', 'AS', 'MP'][i % 3]}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium">
                        {['John Doe', 'Alice Smith', 'Michael Park'][i % 3]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Applied for {['Frontend Developer', 'UX Designer', 'Data Analyst'][i % 3]}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button size="sm">Schedule Interview</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Events</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium">
                        {['Tech Talk: Building Scalable Systems', 'Campus Recruitment Drive'][i % 2]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {['Oct 30, 2024 • 2:00 PM - 3:30 PM', 'Nov 15, 2024 • 10:00 AM - 4:00 PM'][i % 2]}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {['Webinar', 'On-site'][i % 2]}
                        </Badge>
                        <Badge variant="outline">
                          {['Upcoming', 'Registration Open'][i % 2]}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
