import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  FileCheck,
  Briefcase,
  Search,
  Filter,
  Settings,
  Brain,
  AlertTriangle,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Target,
  Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovePosting, useApplications, useCompanyVerifications, useLogbook, usePostings, useUpdateCompanyVerification, useVerifyLogbookEntry, useAddNotification } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AdminPortal = () => {
  const { data: postings = [] } = usePostings();
  const { data: applications = [] } = useApplications();
  const { data: logbook = [] } = useLogbook();
  const approvePosting = useApprovePosting();
  const verifyLogbook = useVerifyLogbookEntry();
  const { data: companyVerifications = [] } = useCompanyVerifications();
  const updateCompany = useUpdateCompanyVerification();
  const addNotification = useAddNotification();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [aiValidationEnabled, setAiValidationEnabled] = useState(true);

  const unverified = postings.filter(p => !p.verified);
  const totalApplications = applications.length;
  const acceptedApplications = applications.filter(a => a.status === "accepted").length;
  const completionRate = Math.round((logbook.filter(l => l.verified).length / (logbook.length || 1)) * 100);

  // Mock user data for user management
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', department: 'Computer Science', joinDate: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'industry', status: 'pending', company: 'TechCorp', joinDate: '2024-01-20' },
    { id: '3', name: 'Dr. Brown', email: 'brown@university.edu', role: 'faculty', status: 'active', department: 'Engineering', joinDate: '2024-01-10' },
    { id: '4', name: 'Admin User', email: 'admin@system.com', role: 'admin', status: 'active', department: 'IT', joinDate: '2024-01-01' }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    toast({ 
      title: "User action", 
      description: `${action} action performed on user ${userId}` 
    });
  };

  const handleAIValidation = async (itemId: string, type: 'company' | 'posting') => {
    // Simulate AI validation
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({ 
      title: "AI Validation Complete", 
      description: `AI has analyzed and provided validation results for ${type}` 
    });
  };
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalApplications}</span>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accepted Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{acceptedApplications}</span>
                <Users className="h-5 w-5 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{unverified.length}</span>
                <Clock className="h-5 w-5 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{completionRate}%</span>
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{mockUsers.length}</span>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active: {mockUsers.filter(u => u.status === 'active').length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">AI Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{aiValidationEnabled ? 'ON' : 'OFF'}</span>
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Auto-validation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">98%</span>
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <Progress value={98} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">3</span>
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pending review</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>System events and user actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New company registered</p>
                      <p className="text-xs text-muted-foreground">TechCorp - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Student completed module</p>
                      <p className="text-xs text-muted-foreground">React Fundamentals - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Verification pending</p>
                      <p className="text-xs text-muted-foreground">5 postings awaiting review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Validation Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users, roles, and permissions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select 
                      className="border rounded-md h-10 px-3 bg-background"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{user.role}</Badge>
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.status === 'pending' && (
                            <Button size="sm" onClick={() => handleUserAction(user.id, 'activate')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'deactivate')}>
                            <UserMinus className="h-4 w-4 mr-2" />
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'delete')}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Department:</span> {user.department || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Company:</span> {user.company || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Joined:</span> {user.joinDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Company Verifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Verifications</CardTitle>
                  <CardDescription>Review and approve industry registrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyVerifications.length === 0 && (
                    <div className="text-sm text-muted-foreground">No company verification requests.</div>
                  )}
                  {companyVerifications.filter(v => v.status === "pending").map((v) => (
                    <div key={v.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{v.companyName}</h3>
                          <p className="text-xs text-muted-foreground">{v.contactName} • {v.email}</p>
                          <p className="text-xs text-muted-foreground">Submitted: {new Date(v.submittedAt).toLocaleString()}</p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-accent text-accent-foreground" onClick={async () => { await updateCompany.mutateAsync({ id: v.id, status: "approved" }); addNotification.mutate({ userRole: "industry", title: "Company Approved", body: `${v.companyName} is approved.` }); toast({ title: "Approved", description: `${v.companyName} approved.` }); }}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={async () => { await updateCompany.mutateAsync({ id: v.id, status: "rejected" }); addNotification.mutate({ userRole: "industry", title: "Company Rejected", body: `${v.companyName} was rejected.` }); toast({ title: "Rejected", description: `${v.companyName} rejected.` }); }}>Reject</Button>
                        <Button size="sm" variant="outline" onClick={() => handleAIValidation(v.id, 'company')}>
                          <Brain className="h-4 w-4 mr-2" />
                          AI Validate
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
                  {unverified.map((internship, index) => (
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
                      {internship.skills?.length ? (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {internship.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      ) : null}
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1" onClick={async () => { await approvePosting.mutateAsync(internship.id); toast({ title: "Approved", description: "Posting approved." }); }}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Request Changes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAIValidation(internship.id, 'posting')}>
                          <Brain className="h-4 w-4 mr-2" />
                          AI Validate
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
                  <CardTitle>Applications by Status</CardTitle>
                  <CardDescription>Distribution across workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(["pending", "accepted", "rejected"] as const).map((status) => {
                    const count = applications.filter(a => a.status === status).length;
                    return (
                      <div key={status} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-muted-foreground capitalize">{status}</span>
                        <Badge>{count}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Posting Verification</CardTitle>
                  <CardDescription>Verified vs under review</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Verified</span>
                    <Badge>{postings.filter(p => p.verified).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Under Review</span>
                    <Badge>{postings.filter(p => !p.verified).length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logbook Verification</CardTitle>
                <CardDescription>Verify student logbook submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logbook.map((entry, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{entry.date}</h3>
                          <p className="text-sm text-muted-foreground">{entry.hours}h • {entry.summary}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.verified ? (
                            <Badge className="bg-accent text-accent-foreground">Verified</Badge>
                          ) : (
                            <>
                              <Badge variant="secondary">Pending</Badge>
                              <Button size="sm" variant="outline" onClick={async () => { await verifyLogbook.mutateAsync(entry.id); toast({ title: "Logbook verified" }); }}>
                                <FileCheck className="h-4 w-4 mr-2" /> Verify
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
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
export default AdminPortal;
