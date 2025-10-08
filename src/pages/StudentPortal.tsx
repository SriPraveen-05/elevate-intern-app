import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ReadinessCircular from "@/components/ReadinessCircular";
import MentoringSection from "@/components/MentoringSection";
import { useAddLogbookEntry, useApplyToInternship, useApplications, useLogbook, useModules, usePostings, useUpsertModuleProgress, useModuleProgress, useBadges, useAwardBadge, useStudentProfile } from "@/hooks/useData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { computeCredits } from "@/lib/storage";
import { 
  BookOpen, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Clock,
  MapPin,
  Building2,
  Lightbulb,
  Trophy,
  AlertCircle,
  User
} from "lucide-react";

const StudentPortal = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: logbook = [] } = useLogbook();
  const { data: postingsData = [] } = usePostings();
  const { data: applications = [] } = useApplications();
  const addLogbook = useAddLogbookEntry();
  const applyMutation = useApplyToInternship();
  const [entryDate, setEntryDate] = useState("");
  const [entryHours, setEntryHours] = useState("");
  const [entrySummary, setEntrySummary] = useState("");
  const { user } = useAuth();
  const currentStudentName = user?.name || "Student";
  
  // Load all data first
  const { data: modules = [] } = useModules();
  const { data: moduleProgress = [] } = useModuleProgress(currentStudentName);
  const upsertProgress = useUpsertModuleProgress();
  const { data: badges = [] } = useBadges(currentStudentName);
  const awardBadge = useAwardBadge();
  const { data: profile } = useStudentProfile(currentStudentName);
  
  // Calculate derived values
  const myApplications = applications.filter(a => a.studentName === currentStudentName);
  const myPending = myApplications.filter(a => a.status === "pending").length;
  const verifiedHours = logbook.filter(e => e.verified).reduce((s, e) => s + (e.hours || 0), 0);
  
  // Get completed modules and compute credits
  const completedModules = moduleProgress.filter(p => p.progress >= 100);
  const completedModuleData = completedModules
    .map(p => modules.find(m => m.id === p.moduleId))
    .filter(Boolean);
  
  const credits = computeCredits({ 
    verifiedHours, 
    completedModules: completedModuleData as any 
  });

  // AI-based recommendations: rule-based skills match
  const studentSkills = new Set<string>();
  completedModules.forEach(p => {
    const mod = modules.find(m => m.id === p.moduleId);
    if (mod?.title.includes('React') || mod?.title.includes('Technical')) studentSkills.add('React');
    if (mod?.title.includes('Communication')) studentSkills.add('Communication');
  });
  const recommendations = postingsData
    .filter(p => p.verified)
    .map(p => ({ posting: p, score: p.skills?.filter(s => studentSkills.has(s)).length || 0 }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const handleAddEntry = async () => {
    if (!entryDate || !entryHours || !entrySummary) {
      toast({ title: "Missing fields", description: "Please fill date, hours and summary." });
      return;
    }
    await addLogbook.mutateAsync({ date: entryDate, hours: Number(entryHours), summary: entrySummary, verified: false });
    setEntryDate("");
    setEntryHours("");
    setEntrySummary("");
    toast({ title: "Entry added", description: "Your logbook entry was saved." });
  };

  const handleApply = async (internship: { id: string; title: string; company: string }) => {
    await applyMutation.mutateAsync({
      studentName: currentStudentName,
      status: "pending",
      internshipId: internship.id,
      internshipTitle: internship.title,
      company: internship.company,
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as any);
    toast({ title: "Applied!", description: `Application submitted to ${internship.company}` });
  };

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
                <span className="text-2xl font-bold">{myApplications.length}</span>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{myPending} under review</p>
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
                <span className="text-2xl font-bold">{credits}</span>
                <Award className="h-5 w-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">This semester</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Readiness Dashboard */}
            <ReadinessCircular />

            {/* Digital Logbook */}
            {/* Digital Logbook (wired) */}
            <Card>
              <CardHeader>
                <CardTitle>Digital Logbook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="md:col-span-3">
                    <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Input type="number" placeholder="Hours" value={entryHours} onChange={(e) => setEntryHours(e.target.value)} />
                  </div>
                  <div className="md:col-span-5">
                    <Textarea placeholder="Summary of work" className="min-h-[40px]" value={entrySummary} onChange={(e) => setEntrySummary(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Button className="w-full h-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddEntry}>Add</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {logbook.map((entry, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold mb-1">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {entry.date}
                            <span className="text-muted-foreground font-normal">•</span>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {entry.hours}h
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.summary}</p>
                      </div>
                      <div className="mt-3 md:mt-0">
                        {entry.verified ? (
                          <Badge className="bg-accent text-accent-foreground">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{logbook.length}</div>
                    <div className="text-xs text-muted-foreground">Total Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{logbook.reduce((s, e) => s + (e.hours || 0), 0)}</div>
                    <div className="text-xs text-muted-foreground">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round((logbook.filter(e => e.verified).length / (logbook.length || 1)) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Verified</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Internships (verified postings) */}
            <Card>
              <CardHeader>
                <CardTitle>Available Internships</CardTitle>
                <CardDescription>Verified opportunities matching your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {postingsData.filter(p => p.verified).map((internship, index) => (
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
                      <Button size="sm" className="flex-1" onClick={() => handleApply(internship)}>Apply Now</Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/internships/${encodeURIComponent(internship.title)}`)}>View Details</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentoring Section */}
            <MentoringSection />

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>Internships matched to your skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recommendations.map((r, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium">{r.posting.title}</div>
                      <div className="text-xs text-muted-foreground">{r.posting.company} • Match: {r.score} skills</div>
                      <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => handleApply(r.posting)}>Apply Now</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Skill Modules (dynamic) */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Modules</CardTitle>
                <CardDescription>Boost your readiness score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((mod) => {
                  const prog = moduleProgress.find(p => p.moduleId === mod.id)?.progress ?? 0;
                  const isDone = prog >= 100;
                  return (
                    <div key={mod.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">{mod.title}</div>
                        {isDone ? (
                          <Badge variant="default">Completed</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">{prog}%</span>
                        )}
                      </div>
                      <Progress value={prog} />
                      <div className="text-xs text-muted-foreground">{mod.description}</div>
                    </div>
                  );
                })}
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

// internships are sourced from postingsData now

const activities = [
  { title: "Application submitted to TechCorp", time: "2 hours ago" },
  { title: "Completed React.js module", time: "1 day ago" },
  { title: "Feedback received from Infosys", time: "2 days ago" }
];

export default StudentPortal;
