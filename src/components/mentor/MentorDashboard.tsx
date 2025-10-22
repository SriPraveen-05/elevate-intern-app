import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Star, 
  BarChart2,
  Plus,
  FileText,
  Video,
  MessageCircle,
  Mail,
  Bookmark,
  Award,
  Target,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock data - in a real app, this would come from API
const mockMentees = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: '',
    program: 'Computer Science',
    progress: 75,
    lastActive: '2 hours ago',
    nextSession: 'Tomorrow, 2:00 PM',
    skills: ['React', 'Node.js', 'TypeScript'],
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Taylor Smith',
    avatar: '',
    program: 'Data Science',
    progress: 45,
    lastActive: '1 day ago',
    nextSession: 'In 3 days, 10:00 AM',
    skills: ['Python', 'Machine Learning', 'Pandas'],
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Jordan Williams',
    avatar: '',
    program: 'UX/UI Design',
    progress: 20,
    lastActive: '3 days ago',
    nextSession: 'Not scheduled',
    skills: ['Figma', 'User Research', 'Prototyping'],
    status: 'needsAttention' as const,
  },
];

const mockResources = [
  {
    id: '1',
    title: 'React Best Practices',
    type: 'guide' as const,
    category: 'Frontend',
    url: '#',
    added: '2 days ago',
  },
  {
    id: '2',
    title: 'System Design Interview Prep',
    type: 'video' as const,
    category: 'Interview',
    url: '#',
    added: '1 week ago',
  },
  {
    id: '3',
    title: 'Resume Template 2024',
    type: 'template' as const,
    category: 'Career',
    url: '#',
    added: '2 weeks ago',
  },
];

export default function MentorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // In a real app, this would come from an API
  const stats = {
    totalMentees: 12,
    activeMentees: 8,
    sessionsThisMonth: 24,
    averageRating: 4.8,
    upcomingSessions: 3,
    pendingTasks: 2,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Mentor'}</h1>
          <p className="text-muted-foreground">
            Guide and support your mentees on their learning journey
          </p>
        </div>
        <Button onClick={() => navigate('/mentor/schedule')}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMentees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMentees} total mentees
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingSessions} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>Based on 42 reviews</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingTasks === 0 ? 'All caught up!' : 'Tasks need attention'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your Mentees</CardTitle>
            <CardDescription>
              Manage and track your mentees' progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {mockMentees.map((mentee) => (
                  <Card key={mentee.id} className="overflow-hidden">
                    <div className="p-4 flex items-start">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={mentee.avatar} />
                        <AvatarFallback>
                          {mentee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{mentee.name}</h3>
                          <Badge 
                            variant={mentee.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {mentee.status === 'active' ? 'Active' : 'Needs Attention'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{mentee.program}</p>
                        
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{mentee.progress}%</span>
                          </div>
                          <Progress value={mentee.progress} className="h-2" />
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          {mentee.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Last active {mentee.lastActive}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{mentee.nextSession}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="icon" className="ml-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Message</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your next mentoring sessions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Mentoring Session</h4>
                        <Badge variant="outline" className="text-xs">
                          {i === 1 ? 'Tomorrow' : 'In 3 days'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {i === 1 ? '2:00 PM - 3:00 PM' : '10:00 AM - 11:00 AM'}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{i === 1 ? 'Alex Johnson' : 'Taylor Smith'}</span>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          <Video className="h-3 w-3 mr-1" />
                          Join Call
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-8">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Quick Actions</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Progress Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Group Update
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-medium mb-4">Recent Resources</h3>
              <div className="space-y-3">
                {mockResources.map((resource) => (
                  <div key={resource.id} className="flex items-center p-2 rounded-lg hover:bg-accent">
                    <div className="bg-accent p-2 rounded-lg">
                      {resource.type === 'video' ? (
                        <Video className="h-4 w-4" />
                      ) : resource.type === 'guide' ? (
                        <BookOpen className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.category} • {resource.added}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-up-right"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                      <span className="sr-only">Open</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mentee Progress</CardTitle>
            <CardDescription>Track your mentees' skill development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { skill: 'React', level: 85, target: 100 },
                { skill: 'Node.js', level: 70, target: 90 },
                { skill: 'TypeScript', level: 65, target: 85 },
                { skill: 'System Design', level: 40, target: 75 },
              ].map((item) => (
                <div key={item.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.skill}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.level}% of {item.target}% target
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={(item.level / item.target) * 100} className="h-2" />
                    <span className="text-xs text-muted-foreground w-12">
                      {Math.round((item.level / item.target) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mentor Statistics</CardTitle>
            <CardDescription>Your mentoring impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">Total Mentees</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">42</div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">85%</div>
                <p className="text-sm text-muted-foreground">Goal Achievement</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Quick Tips</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Schedule regular check-ins with your mentees</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Provide constructive feedback after each session</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Share relevant resources and learning materials</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
