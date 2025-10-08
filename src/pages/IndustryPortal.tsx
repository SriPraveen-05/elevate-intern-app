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
import { useApplications, useApprovePosting, useCreatePosting, usePostings, useUpdateApplicationStatus, useCompanyVerifications, useSubmitCompanyVerification, useAddNotification } from "@/hooks/useData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const IndustryPortal = () => {
  const { data: postingsData = [] } = usePostings();
  const { data: applicationsData = [] } = useApplications();
  const createPosting = useCreatePosting();
  const approvePosting = useApprovePosting();
  const updateApp = useUpdateApplicationStatus();
  const { data: companyVerifications = [] } = useCompanyVerifications();
  const submitVerification = useSubmitCompanyVerification();
  const addNotification = useAddNotification();
  const { toast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");

  const companyName = user?.name || "Your Company";
  const myVerification = companyVerifications.find(v => v.companyName === companyName);
  const isApproved = myVerification?.status === "approved";

  // Helpers and derived stats
  const formatPostedAt = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch {
      return iso as string;
    }
  };

  const totalActivePostings = postingsData.length;
  const totalApplications = applicationsData.length;
  const totalAccepted = applicationsData.filter(a => a.status === "accepted").length;
  const pendingVerification = postingsData.filter(p => !p.verified).length;

  const handleCreate = async () => {
    if (!title || !duration || !location) {
      toast({ title: "Missing fields", description: "Title, duration and location are required." });
      return;
    }
    if (!isApproved) {
      toast({ title: "Verification required", description: "Your company must be approved before posting." });
      return;
    }
    await createPosting.mutateAsync({
      title,
      company: companyName,
      duration,
      location,
      stipend,
      description,
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      verified: false,
      applications: 0,
      postedAt: new Date().toISOString(),
      id: "",
    } as any);
    setTitle(""); setDuration(""); setLocation(""); setStipend(""); setDescription(""); setSkills("");
    toast({ title: "Submitted", description: "Posting submitted for verification." });
  };

  const handleApprove = async (id: string) => {
    await approvePosting.mutateAsync(id);
    toast({ title: "Verified", description: "Posting marked as verified." });
  };

  const handleAccept = async (id: string) => {
    await updateApp.mutateAsync({ id, status: "accepted" });
    addNotification.mutate({ userRole: "student", title: "Application Accepted", body: "Your internship application was accepted." });
    toast({ title: "Accepted", description: "Application accepted." });
  };

  const handleReject = async (id: string) => {
    await updateApp.mutateAsync({ id, status: "rejected" });
    addNotification.mutate({ userRole: "student", title: "Application Rejected", body: "Your internship application was rejected." });
    toast({ title: "Rejected", description: "Application rejected." });
  };

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
          <Button className="bg-gradient-accent" disabled={!isApproved} title={!isApproved ? "Company must be verified to post" : undefined}>
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
                <span className="text-2xl font-bold">{totalActivePostings}</span>
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
                <span className="text-2xl font-bold">{totalApplications}</span>
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{applicationsData.filter(a => a.status === "pending").length} pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalAccepted}</span>
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
                <span className="text-2xl font-bold">{pendingVerification}</span>
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
                  {applicationsData.map((app, index) => (
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
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleAccept(app.id)}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(app.id)}>
                          Reject
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
                  {postingsData.map((posting, index) => (
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
                          Posted {formatPostedAt(posting.postedAt)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        {!posting.verified && (
                          <Button size="sm" variant="ghost" onClick={() => handleApprove(posting.id)}>Mark Verified</Button>
                        )}
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
                {!isApproved && (
                  <div className="p-3 rounded-md border border-border bg-muted/30 text-sm">
                    Your company is not verified yet. Submit verification below and wait for admin approval to enable posting.
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Internship Title</Label>
                    <Input id="title" placeholder="e.g., Full Stack Developer Intern" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 3 months" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Bangalore or Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Stipend (Optional)</Label>
                    <Input id="stipend" placeholder="e.g., ₹15,000/month" value={stipend} onChange={(e) => setStipend(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the role, responsibilities, and learning outcomes..." value={description} onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                  <Input id="skills" placeholder="e.g., React, Node.js, MongoDB" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>

                <div className="flex gap-2">
                  <Button className="bg-gradient-accent" onClick={handleCreate} disabled={!isApproved} title={!isApproved ? "Company must be verified to post" : undefined}>Submit for Verification</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>

            {/* Company Verification Submission */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Company Verification</CardTitle>
                <CardDescription>Submit your company for admin approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={companyName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input value={myVerification?.status ?? "not submitted"} disabled />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-gradient-accent"
                    onClick={async () => {
                      if (!contactName || !email) { toast({ title: "Missing fields", description: "Contact name and email are required." }); return; }
                      await submitVerification.mutateAsync({ companyName, contactName, email });
                      setContactName(""); setEmail("");
                      toast({ title: "Submitted", description: "Verification submitted. Await admin approval." });
                    }}
                    disabled={myVerification?.status === "pending" || isApproved}
                    title={isApproved ? "Already approved" : myVerification?.status === "pending" ? "Already pending" : undefined}
                  >
                    {isApproved ? "Approved" : myVerification?.status === "pending" ? "Pending" : "Submit Verification"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default IndustryPortal;
