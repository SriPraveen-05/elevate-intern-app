import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { useState, ReactNode } from "react";
import {
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  AlertCircle,
  Bell,
  Search,
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
  Download,
  Filter
} from "lucide-react";

// Import the hook and types from the correct path
import { useMentorData } from "@/hooks/useMentorData";
import type { Mentee, Resource, Session } from "@/hooks/useMentorData";

// Define local interfaces that extend the imported ones if needed
interface DashboardStats {
  totalMentees: number;
  activeMentees: number;
  sessionsThisMonth: number;
  averageRating: number;
  upcomingSessions: number;
  pendingTasks: number;
  goalAchievement: number;
}

interface DashboardStatsProps {
  stats: DashboardStats | null;
}

// Mock data - in a real app, this would come from API
const mockMentees: Mentee[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: '',
    program: 'Computer Science',
    university: 'Stanford University',
    progress: 75,
    lastActive: '2 hours ago',
    nextSession: '2023-12-15T14:00:00',
    skills: ['React', 'Node.js', 'TypeScript'],
    status: 'active',
    joinedDate: '2023-01-15',
    sessionsCompleted: 10,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Taylor Smith',
    avatar: '',
    program: 'Data Science',
    university: 'MIT',
    progress: 45,
    lastActive: '1 day ago',
    nextSession: '2023-12-18T10:00:00',
    skills: ['Python', 'Machine Learning', 'Pandas'],
    status: 'active',
    joinedDate: '2023-02-20',
    sessionsCompleted: 5,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Jordan Williams',
    avatar: '',
    program: 'UX/UI Design',
    university: 'RISD',
    progress: 20,
    lastActive: '3 days ago',
    nextSession: null,
    skills: ['Figma', 'User Research', 'Prototyping'],
    status: 'needsAttention',
    joinedDate: '2024-03-10',
    sessionsCompleted: 2,
    rating: 4.5
  },
  {
    id: '4',
    name: 'Casey Kim',
    avatar: '',
    program: 'Cybersecurity',
    university: 'Carnegie Mellon',
    progress: 90,
    lastActive: '5 hours ago',
    nextSession: 'Today, 4:30 PM',
    skills: ['Ethical Hacking', 'Network Security', 'Cryptography'],
    status: 'active',
    joinedDate: '2023-11-05',
    sessionsCompleted: 12,
    rating: 5.0
  },
];

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'React Best Practices Guide',
    type: 'guide',
    category: 'Frontend Development',
    url: '#',
    added: '2 days ago',
    description: 'Comprehensive guide to React patterns and best practices',
    icon: <FileText className="h-5 w-5 text-blue-500" />
  },
  {
    id: '2',
    title: 'System Design Interview Prep',
    type: 'video',
    category: 'Interview Preparation',
    url: '#',
    added: '1 week ago',
    duration: '45 min',
    description: 'Master system design interviews with real-world examples',
    icon: <Video className="h-5 w-5 text-purple-500" />
  },
  {
    id: '3',
    title: 'Resume Template 2024',
    type: 'template',
    category: 'Career Development',
    url: '#',
    added: '2 weeks ago',
    description: 'ATS-friendly resume template with examples',
    icon: <FileText className="h-5 w-5 text-green-500" />
  },
  {
    id: '4',
    title: 'Project Planning Worksheet',
    type: 'worksheet',
    category: 'Project Management',
    url: '#',
    added: '3 days ago',
    description: 'Structured worksheet for planning technical projects',
    icon: <FileText className="h-5 w-5 text-amber-500" />
  },
];

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Code Review Session',
    mentee: {
      id: '1',
      name: 'Alex Johnson',
      avatar: ''
    },
    date: new Date(Date.now() + 86400000), // Tomorrow
    duration: 45,
    status: 'upcoming',
    meetingLink: 'https://meet.example.com/abc123',
    notes: 'Review React project structure and state management'
  },
  {
    id: '2',
    title: 'Career Guidance',
    mentee: {
      id: '2',
      name: 'Taylor Smith',
      avatar: ''
    },
    date: new Date(Date.now() + 3 * 86400000), // 3 days from now
    duration: 30,
    status: 'upcoming',
    notes: 'Discuss job search strategy and interview preparation'
  },
  {
    id: '3',
    title: 'Portfolio Review',
    mentee: {
      id: '3',
      name: 'Jordan Williams',
      avatar: ''
    },
    date: new Date(Date.now() - 2 * 86400000), // 2 days ago
    duration: 60,
    status: 'completed',
    notes: 'Reviewed portfolio website and provided UX feedback'
  }
];

// Helper Components
interface MenteeCardProps {
  mentee: Mentee;
}

function MenteeCard({ mentee }: MenteeCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
      <div className="flex items-start">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={mentee.avatar} alt={mentee.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {mentee.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              <Link to={`/mentor/mentees/${mentee.id}`} className="hover:underline">
                {mentee.name}
              </Link>
            </h3>
            <Badge 
              variant={
                mentee.status === 'active' ? 'default' :
                mentee.status === 'needsAttention' ? 'secondary' : 'outline'
              }
              className="text-xs"
            >
              {mentee.status === 'needsAttention' ? 'Needs Attention' : 
               mentee.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">{mentee.program}</p>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{mentee.progress}%</span>
            </div>
            <Progress value={mentee.progress} className="h-2" />
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {mentee.skills.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentee.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentee.skills.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{mentee.lastActive}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: Session;
  onClick?: () => void;
}

function SessionCard({ session, onClick }: SessionCardProps) {
  const isUpcoming = session.status === 'upcoming';
  const isCompleted = session.status === 'completed';
  
  return (
    <div 
      className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
        isUpcoming ? 'bg-blue-50 border-blue-200' : 'bg-card'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{session.title}</h4>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarImage src={session.mentee.avatar} alt={session.mentee.name} />
              <AvatarFallback className="text-xs">
                {session.mentee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span>with {session.mentee.name}</span>
          </div>
        </div>
        <Badge 
          variant={
            isUpcoming ? 'default' :
            isCompleted ? 'secondary' : 'destructive'
          }
          className="text-xs"
        >
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </Badge>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{format(session.date, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{format(session.date, 'h:mm a')} ({session.duration} min)</span>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        {isUpcoming && session.meetingLink && (
          <Button size="sm" className="flex-1" asChild>
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
              Join Meeting
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" className="flex-1">
          {isCompleted ? 'View Notes' : 'Add Notes'}
        </Button>
      </div>
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const getIcon = () => {
    switch (resource.type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'template':
        return <FileText className="h-5 w-5" />;
      case 'worksheet':
        return <FileText className="h-5 w-5" />;
      case 'checklist':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
      <div className="flex items-start">
        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
          {getIcon()}
        </div>
        
        <div className="ml-4 flex-1">
          <h4 className="font-medium">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline flex items-center"
            >
              {resource.title}
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </a>
          </h4>
          
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <span>{resource.category}</span>
            <span className="mx-2">•</span>
            <span>{resource.type}</span>
            {resource.duration && (
              <>
                <span className="mx-2">•</span>
                <span>{resource.duration}</span>
              </>
            )}
          </div>
          
          {resource.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {resource.description}
            </p>
          )}
          
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Added {formatDistanceToNow(new Date(resource.added), { addSuffix: true })}</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Bookmark className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Mentees
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalMentees || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.activeMentees || 0} currently active
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sessions This Month
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.sessionsThisMonth || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.upcomingSessions || 0} upcoming
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Rating
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {stats?.sessionsThisMonth || 0} sessions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Tasks
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.pendingTasks || 0}</div>
          <p className="text-xs text-muted-foreground">
            Tasks need your attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MentorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('mentees');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const { data, isLoading, error } = useMentorData();
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't load the dashboard data. Please try again later.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  const { mentees, sessions, resources, quickTips, stats } = data;
  
  const filteredMentees = mentees.filter(mentee => 
    mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentee.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentee.skills?.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.mentee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.category && resource.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    resource.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const upcomingSessions = sessions
    .filter(session => session.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-indigo-600">Mentor Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name || 'Mentor'}!</h2>
            <p className="text-muted-foreground">
              Here's what's happening with your mentees today.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
        
        <DashboardStats stats={stats} />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Your mentoring activities and progress this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <BarChart2 className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Charts coming soon</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>
                Your next {upcomingSessions.length} sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map(session => (
                    <SessionCard 
                      key={session.id} 
                      session={session}
                      onClick={() => console.log('View session', session.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No upcoming sessions</p>
                    <p className="text-sm">Schedule a session to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs 
          defaultValue="mentees" 
          className="space-y-4"
          onValueChange={setActiveTab}
        >
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="mentees">Mentees</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:max-w-sm flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={`Search ${activeTab}...`}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    ×
                  </Button>
                )}
              </div>
              
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <TabsContent value="mentees" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMentees.length > 0 ? (
                filteredMentees.map(mentee => (
                  <MenteeCard key={mentee.id} mentee={mentee} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No mentees found</h3>
                  <p className="text-sm text-muted-foreground">
                    No mentees match your search criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-4">
            <div className="space-y-4">
              {filteredSessions.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSessions.map(session => (
                    <SessionCard 
                      key={session.id} 
                      session={session}
                      onClick={() => console.log('View session', session.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No sessions found</h3>
                  <p className="text-sm text-muted-foreground">
                    No sessions match your search criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <div className="space-y-4">
              {filteredResources.length > 0 ? (
                <div className="grid gap-4">
                  {filteredResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No resources found</h3>
                  <p className="text-sm text-muted-foreground">
                    No resources match your search criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right sidebar */}
      <div className="lg:w-80 border-t lg:border-t-0 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Start Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create Resource
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div className="ml-3 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Session with {recentMentees[i % recentMentees.length]?.name || 'Mentee'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i === 0 ? 'Just now' : `${i} hours ago`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Goal Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Monthly Target</span>
                <span>{stats.goalAchievement}%</span>
              </div>
              <Progress value={stats.goalAchievement} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {stats.sessionsThisMonth} of {Math.ceil(stats.sessionsThisMonth / (stats.goalAchievement / 100))} sessions completed this month
              </p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold">
                    {Math.max(0, Math.ceil(stats.sessionsThisMonth / (stats.goalAchievement / 100)) - stats.sessionsThisMonth)}
                  </div>
                  <p className="text-sm text-muted-foreground">Sessions Left</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold">{stats.goalAchievement}%</div>
                  <p className="text-sm text-muted-foreground">Goal Achievement</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Quick Tips</h4>
                <ul className="space-y-2 text-sm">
                  {quickTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px] mt-2" />
              <Skeleton className="h-4 w-[150px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
