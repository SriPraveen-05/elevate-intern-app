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
  FileCheck,
  Briefcase
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovePosting, useApplications, useCompanyVerifications, useLogbook, usePostings, useUpdateCompanyVerification, useVerifyLogbookEntry, useAddNotification } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";

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
  const unverified = postings.filter(p => !p.verified);
  const totalApplications = applications.length;
  const acceptedApplications = applications.filter(a => a.status === "accepted").length;
  const completionRate = Math.round((logbook.filter(l => l.verified).length / (logbook.length || 1)) * 100);
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
