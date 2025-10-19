import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApplications, useModules, useLogbook, usePostings, useStudentProfile, useUpdateApplicationStatus, useAddNotification } from "@/hooks/useData";
import { computeCredits, checkCreditTransferEligibility, DEPARTMENT_REGULATIONS, listAllModuleProgress, listModules } from "@/lib/storage";
import { Award, BookOpen, TrendingUp, FileText, Download, CheckCircle, XCircle, AlertCircle, Users, Brain, Target, BarChart3, Clock, Star, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simple student aggregation from existing data until real backend
function useStudents() {
  const { data: applications = [] } = useApplications();
  // derive set of names from applications and module progress
  const moduleProgress = useMemo(() => listAllModuleProgress(), []);
  const names = useMemo(() => {
    const set = new Set<string>();
    applications.forEach(a => a.studentName && set.add(a.studentName));
    moduleProgress.forEach(p => p.userName && set.add(p.userName));
    return Array.from(set);
  }, [applications, moduleProgress]);
  return names;
}

export default function FacultyPanel() {
  const students = useStudents();
  const { data: postings = [] } = usePostings();
  const { data: applications = [] } = useApplications();
  const updateApplication = useUpdateApplicationStatus();
  const addNotification = useAddNotification();
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // AI-based recommendations: rule-based skills overlap
  const recommendationsPerStudent = useMemo(() => {
    const map: Record<string, Array<{ posting: any; score: number }>> = {};
    students.forEach(studentName => {
      // Get student's completed modules to infer skill tags
      const progress = listAllModuleProgress().filter(p => p.userName === studentName && p.progress >= 100);
      const studentSkills = new Set<string>();
      progress.forEach(p => {
        // Infer skills from module titles (simplified)
        if (p.moduleId.includes('React') || p.moduleId.includes('Technical')) studentSkills.add('React');
        if (p.moduleId.includes('Communication')) studentSkills.add('Communication');
        if (p.moduleId.includes('Python')) studentSkills.add('Python');
        if (p.moduleId.includes('Data')) studentSkills.add('Data Science');
      });
      // Match with verified postings
      const verified = postings.filter(p => p.verified);
      const scored = verified.map(posting => {
        const overlap = posting.skills?.filter((s: string) => studentSkills.has(s)).length || 0;
        return { posting, score: overlap };
      }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
      map[studentName] = scored.slice(0, 3);
    });
    return map;
  }, [students, postings]);

  const handleApproveApplication = async (applicationId: string, studentName: string) => {
    try {
      await updateApplication.mutateAsync({ id: applicationId, status: "accepted" });
      await addNotification.mutateAsync({ 
        userRole: "student", 
        title: "Application Approved", 
        body: `Your internship application has been approved by your mentor.` 
      });
      toast({ title: "Application approved", description: `${studentName}'s application has been approved.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve application." });
    }
  };

  const handleRejectApplication = async (applicationId: string, studentName: string) => {
    try {
      await updateApplication.mutateAsync({ id: applicationId, status: "rejected" });
      await addNotification.mutateAsync({ 
        userRole: "student", 
        title: "Application Rejected", 
        body: `Your internship application was rejected. Please contact your mentor for feedback.` 
      });
      toast({ title: "Application rejected", description: `${studentName}'s application has been rejected.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject application." });
    }
  };

  const pendingApplications = applications.filter(app => app.status === "pending");
  const approvedApplications = applications.filter(app => app.status === "accepted");
  const totalStudents = students.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Mentor Portal</h1>
          <p className="text-muted-foreground">SmartMatch AI, application approval, and student progress tracking</p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalStudents}</span>
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{pendingApplications.length}</span>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{approvedApplications.length}</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">SmartMatch Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">94%</span>
                <Brain className="h-5 w-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">AI accuracy</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="smartmatch">SmartMatch AI</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Review</CardTitle>
                <CardDescription>Review and approve student internship applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No pending applications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApplications.map((app) => (
                      <div key={app.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{app.studentName}</h3>
                            <p className="text-sm text-muted-foreground">{app.internshipTitle} at {app.company}</p>
                            <p className="text-xs text-muted-foreground">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="secondary">Pending Review</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-sm">
                            <span className="font-medium">Readiness Score: </span>
                            <Badge className="bg-accent text-accent-foreground">{app.readinessScore || 85}%</Badge>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Department: </span>
                            <span className="text-muted-foreground">Computer Science</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveApplication(app.id, app.studentName)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectApplication(app.id, app.studentName)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smartmatch" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  SmartMatch AI
                </CardTitle>
                <CardDescription>AI-powered internship matching based on student skills and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-6">
                  {students.map((studentName) => (
                    <Card key={studentName} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{studentName}</CardTitle>
                        <CardDescription>AI Recommendations</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {recommendationsPerStudent[studentName]?.length > 0 ? (
                          recommendationsPerStudent[studentName].map((rec, index) => (
                            <div key={index} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-medium text-sm">{rec.posting.title}</div>
                                  <div className="text-xs text-muted-foreground">{rec.posting.company}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-accent">{rec.score * 20}%</div>
                                  <div className="text-xs text-muted-foreground">Match</div>
                                </div>
                              </div>
                              <Progress value={rec.score * 20} className="h-2" />
                              <div className="flex flex-wrap gap-1 mt-2">
                                {rec.posting.skills?.slice(0, 3).map((skill: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">No recommendations available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {students.map((name) => (
                <StudentCreditCard key={name} name={name} recommendations={recommendationsPerStudent[name] || []} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Department Analytics
                </CardTitle>
                <CardDescription>Performance insights and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold mb-1">78%</div>
                    <div className="text-sm text-muted-foreground">Average Readiness Score</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold mb-1">92%</div>
                    <div className="text-sm text-muted-foreground">Application Success Rate</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold mb-1">4.2</div>
                    <div className="text-sm text-muted-foreground">Average NEP Credits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StudentCreditCard({ name, recommendations }: { name: string; recommendations: Array<{ posting: any; score: number }> }) {
  // We compute verified hours and credits using the existing hooks patterns from StudentPortal
  // To avoid circular imports, we recompute verified hours using the applications hook isn't correct; use window.localStorage directly for logbook
  const verifiedHours = useMemo(() => {
    try {
      const raw = localStorage.getItem("app.logbook");
      const entries: Array<{ verified?: boolean; hours?: number; studentName?: string }> = raw ? JSON.parse(raw) : [];
      return entries.filter(e => e.verified && (!e.studentName || e.studentName === name)).reduce((s, e) => s + (e.hours || 0), 0);
    } catch {
      return 0;
    }
  }, [name]);

  // Compute credits from verified hours and completed modules
  const completedModulesData = useMemo(() => {
    const progress = listAllModuleProgress().filter(p => p.userName === name && p.progress >= 100);
    const modules = listModules();
    return progress.map(p => modules.find(m => m.id === p.moduleId)).filter(Boolean);
  }, [name]);
  
  const credits = useMemo(() => computeCredits({ 
    verifiedHours, 
    completedModules: completedModulesData as any 
  }), [verifiedHours, completedModulesData]);
  
  // Get student profile for credit transfer eligibility
  const { data: profile } = useStudentProfile(name);
  const eligibility = useMemo(() => checkCreditTransferEligibility({
    department: profile?.department || "Computer Science",
    verifiedHours,
    completedModulesCount: completedModulesData.length,
    cgpa: profile?.academicDetails?.cgpa,
  }), [profile, verifiedHours, completedModulesData]);
  
  const eligible = credits >= 4; // arbitrary threshold, configurable later

  const downloadReport = () => {
    const lines: string[] = [];
    lines.push(`NEP Credit Report for ${name}`);
    lines.push(`Credits: ${credits}`);
    lines.push(`Verified Hours: ${verifiedHours}`);
    lines.push("");
    lines.push("Logbook Summary:");
    try {
      const raw = localStorage.getItem("app.logbook");
      const entries: Array<{ date: string; hours: number; summary: string; verified: boolean; studentName?: string }> = raw ? JSON.parse(raw) : [];
      entries.filter(e => (!e.studentName || e.studentName === name)).forEach(e => {
        lines.push(`${e.date}, ${e.hours}h, ${e.verified ? "Verified" : "Pending"}, ${e.summary}`);
      });
    } catch {}
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nep_report_${name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Automatic NEP credit calculation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4 items-center">
          <div>
            <div className="text-xs text-muted-foreground">Credits</div>
            <div className="text-2xl font-bold">{credits}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Verified Hours</div>
            <div className="text-2xl font-bold">{verifiedHours}</div>
          </div>
          <div className="ml-auto">
            <Badge variant={eligible ? "default" : "secondary"}>{eligible ? "Eligible" : "Not Eligible"}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={downloadReport}>Download Report</Button>
        </div>
        {recommendations.length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <div className="text-xs font-semibold">AI Recommendations</div>
            </div>
            {recommendations.map((r, i) => (
              <div key={i} className="text-xs p-2 bg-muted/20 rounded mb-1">
                {r.posting.title} at {r.posting.company} (Match: {r.score} skills)
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
