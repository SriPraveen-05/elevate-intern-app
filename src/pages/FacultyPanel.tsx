import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApplications, useModules, useLogbook, usePostings, useStudentProfile } from "@/hooks/useData";
import { computeCredits, checkCreditTransferEligibility, DEPARTMENT_REGULATIONS, listAllModuleProgress, listModules } from "@/lib/storage";
import { Award, BookOpen, TrendingUp, FileText, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { Lightbulb } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Faculty Panel</h1>
          <p className="text-muted-foreground">NEP credit calculation and AI-based recommendations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {students.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Students Found</CardTitle>
                <CardDescription>Students will appear here once they apply or complete modules.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {students.map((name) => (
            <StudentCreditCard key={name} name={name} recommendations={recommendationsPerStudent[name] || []} />
          ))}
        </div>
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
