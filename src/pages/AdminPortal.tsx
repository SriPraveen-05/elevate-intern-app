import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InternshipAnalytics from "@/components/InternshipAnalytics";
import CreditCalculator from "@/components/CreditCalculator";
import { 
  Shield,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  FileCheck
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor, verify, and analyze platform activities</p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">10,234</span>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-accent mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">487</span>
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-xs text-accent mt-1">↑ 8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">23</span>
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">94%</span>
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <p className="text-xs text-accent mt-1">↑ 3% from last quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Student Monitoring</TabsTrigger>
          </TabsList>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Company Verifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Verifications</CardTitle>
                  <CardDescription>Review and approve company registrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyVerifications.map((company, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.industry}</p>
                        </div>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Submitted: {company.submittedDate}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Internship Post Verifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Internship Verifications</CardTitle>
                  <CardDescription>Approve internship postings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {internshipVerifications.map((internship, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold mb-1">{internship.title}</h3>
                          <p className="text-sm text-muted-foreground">{internship.company}</p>
                        </div>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Review
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {internship.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Request Changes
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Chart */}
            <InternshipAnalytics />

            {/* Credit Calculator */}
            <CreditCalculator />

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Internship Statistics</CardTitle>
                  <CardDescription>Overview of platform activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statistics.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                      <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="bg-accent text-accent-foreground">
                        {stat.change}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Industries</CardTitle>
                  <CardDescription>Most active sectors this quarter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {industries.map((industry, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{industry.name}</span>
                        <span className="text-sm text-muted-foreground">{industry.count} internships</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-hero" 
                          style={{ width: `${industry.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Common Rejection Reasons</CardTitle>
                <CardDescription>Help improve curriculum and student preparation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rejectionReasons.map((reason, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="font-medium">{reason.reason}</span>
                      <Badge>{reason.count} cases</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress Monitoring</CardTitle>
                <CardDescription>Track active internships and logbook submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeInternships.map((student, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold mb-1">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.position} at {student.company}</p>
                        </div>
                        <Badge className={student.logbookStatus === "up-to-date" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}>
                          {student.logbookStatus === "up-to-date" ? "On Track" : "Delayed"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="font-semibold">{student.progress}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Milestones</p>
                          <p className="font-semibold">{student.milestonesCompleted}/{student.totalMilestones}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Update</p>
                          <p className="font-semibold">{student.lastUpdate}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <FileCheck className="h-4 w-4 mr-2" />
                        View Logbook
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const companyVerifications = [
  { name: "TechVentures Pvt Ltd", industry: "Information Technology", submittedDate: "2 days ago" },
  { name: "Green Energy Solutions", industry: "Renewable Energy", submittedDate: "4 days ago" },
  { name: "FinTech Innovations", industry: "Financial Services", submittedDate: "1 week ago" }
];

const internshipVerifications = [
  { title: "Machine Learning Intern", company: "AI Labs India", skills: ["Python", "TensorFlow", "ML"] },
  { title: "Digital Marketing Intern", company: "Brand Builders", skills: ["SEO", "Content", "Analytics"] },
  { title: "Backend Developer", company: "CloudTech", skills: ["Java", "Spring Boot", "AWS"] }
];

const statistics = [
  { icon: Users, label: "Total Applications", value: "8,456", change: "+15%", trend: "up" },
  { icon: CheckCircle, label: "Accepted Students", value: "3,234", change: "+12%", trend: "up" },
  { icon: BarChart3, label: "Avg. Readiness Score", value: "76%", change: "+5%", trend: "up" },
  { icon: TrendingUp, label: "NEP Credits Issued", value: "12,890", change: "+18%", trend: "up" }
];

const industries = [
  { name: "Information Technology", count: 245, percentage: 100 },
  { name: "Finance & Banking", count: 178, percentage: 73 },
  { name: "Manufacturing", count: 134, percentage: 55 },
  { name: "Healthcare", count: 98, percentage: 40 },
  { name: "E-commerce", count: 87, percentage: 35 }
];

const rejectionReasons = [
  { reason: "Insufficient technical skills", count: 145 },
  { reason: "Poor communication skills", count: 98 },
  { reason: "Lack of relevant projects", count: 76 },
  { reason: "Domain knowledge gap", count: 54 }
];

const activeInternships = [
  {
    name: "Ananya Singh",
    position: "Full Stack Developer",
    company: "TechCorp",
    progress: 65,
    milestonesCompleted: 4,
    totalMilestones: 6,
    lastUpdate: "Yesterday",
    logbookStatus: "up-to-date"
  },
  {
    name: "Rohan Gupta",
    position: "Data Analyst",
    company: "DataViz",
    progress: 42,
    milestonesCompleted: 2,
    totalMilestones: 5,
    lastUpdate: "5 days ago",
    logbookStatus: "delayed"
  },
  {
    name: "Kavya Menon",
    position: "UI/UX Designer",
    company: "Creative Labs",
    progress: 88,
    milestonesCompleted: 5,
    totalMilestones: 6,
    lastUpdate: "Today",
    logbookStatus: "up-to-date"
  }
];

export default AdminPortal;
