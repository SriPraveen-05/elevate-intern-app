import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus,
  Users, 
  Briefcase, 
  CheckCircle,
  Clock,
  FileText,
  Search
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IndustryPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Industry Dashboard</h1>
            <p className="text-muted-foreground">Manage internship postings and applications</p>
          </div>
          <Button className="bg-gradient-accent">
            <Plus className="h-4 w-4 mr-2" />
            Post New Internship
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">12</span>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">156</span>
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">48 pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">45</span>
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">3</span>
                <Clock className="h-5 w-5 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="postings">My Postings</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Review and manage student applications</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search applications..." className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{app.studentName}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{app.college}</p>
                          <Badge variant="outline">{app.position}</Badge>
                        </div>
                        <Badge variant={app.status === "pending" ? "secondary" : "default"}>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-sm text-muted-foreground">Readiness Score: </span>
                        <Badge className="bg-accent text-accent-foreground">{app.readinessScore}%</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject & Feedback
                        </Button>
                        <Button size="sm" variant="ghost">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Postings Tab */}
          <TabsContent value="postings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Internship Postings</CardTitle>
                <CardDescription>Manage your current internship opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postings.map((posting, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{posting.title}</h3>
                          <p className="text-sm text-muted-foreground">{posting.duration} • {posting.location}</p>
                        </div>
                        <Badge className={posting.verified ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}>
                          {posting.verified ? "Verified" : "Under Review"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {posting.applications} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Posted {posting.postedDate}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create New Tab */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Post New Internship</CardTitle>
                <CardDescription>Create a new internship opportunity for students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Internship Title</Label>
                    <Input id="title" placeholder="e.g., Full Stack Developer Intern" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 3 months" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Bangalore or Remote" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Stipend (Optional)</Label>
                    <Input id="stipend" placeholder="e.g., ₹15,000/month" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the role, responsibilities, and learning outcomes..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                  <Input id="skills" placeholder="e.g., React, Node.js, MongoDB" />
                </div>

                <div className="flex gap-2">
                  <Button className="bg-gradient-accent">Submit for Verification</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const applications = [
  {
    studentName: "Rahul Sharma",
    college: "IIT Delhi",
    position: "Full Stack Developer",
    readinessScore: 85,
    status: "pending"
  },
  {
    studentName: "Priya Patel",
    college: "NIT Trichy",
    position: "Data Analytics",
    readinessScore: 78,
    status: "pending"
  },
  {
    studentName: "Amit Kumar",
    college: "VIT Vellore",
    position: "UI/UX Design",
    readinessScore: 92,
    status: "pending"
  }
];

const postings = [
  {
    title: "Full Stack Development Intern",
    duration: "3 months",
    location: "Bangalore",
    applications: 45,
    postedDate: "2 weeks ago",
    verified: true
  },
  {
    title: "Data Science Intern",
    duration: "6 months",
    location: "Remote",
    applications: 67,
    postedDate: "1 month ago",
    verified: true
  },
  {
    title: "Mobile App Developer",
    duration: "4 months",
    location: "Hyderabad",
    applications: 23,
    postedDate: "3 days ago",
    verified: false
  }
];

export default IndustryPortal;
