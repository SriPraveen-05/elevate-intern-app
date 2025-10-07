import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Clock,
  MapPin,
  Building2 
} from "lucide-react";

const StudentPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Priya!</h1>
          <p className="text-muted-foreground">Track your internship journey and discover new opportunities</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Internship Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">78%</span>
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <Progress value={78} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">5</span>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">3 under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Modules Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">12/15</span>
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">3 remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">NEP Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">8</span>
                <Award className="h-5 w-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">This semester</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Internships */}
            <Card>
              <CardHeader>
                <CardTitle>Available Internships</CardTitle>
                <CardDescription>Verified opportunities matching your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {internships.map((internship, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{internship.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {internship.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {internship.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {internship.duration}
                          </span>
                        </div>
                      </div>
                      <Badge variant={internship.verified ? "default" : "secondary"} className="bg-accent text-accent-foreground">
                        Verified
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {internship.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Apply Now</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Modules */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Modules</CardTitle>
                <CardDescription>Boost your readiness score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{module.name}</span>
                      <span className="text-xs text-muted-foreground">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      {module.progress === 100 ? "Review" : "Continue"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const internships = [
  {
    title: "Full Stack Development Intern",
    company: "TechCorp India",
    location: "Bangalore",
    duration: "3 months",
    verified: true,
    skills: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "Data Analytics Intern",
    company: "DataViz Solutions",
    location: "Remote",
    duration: "6 months",
    verified: true,
    skills: ["Python", "SQL", "Tableau"]
  },
  {
    title: "UI/UX Design Intern",
    company: "Creative Studios",
    location: "Mumbai",
    duration: "4 months",
    verified: true,
    skills: ["Figma", "User Research", "Prototyping"]
  }
];

const modules = [
  { name: "Communication Skills", progress: 100 },
  { name: "Technical Interview Prep", progress: 60 },
  { name: "Professional Ethics", progress: 30 }
];

const activities = [
  { title: "Application submitted to TechCorp", time: "2 hours ago" },
  { title: "Completed React.js module", time: "1 day ago" },
  { title: "Feedback received from Infosys", time: "2 days ago" }
];

export default StudentPortal;
