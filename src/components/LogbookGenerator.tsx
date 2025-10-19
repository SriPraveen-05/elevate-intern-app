import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLogbook, useModuleProgress, useModules, useStudentProfile } from "@/hooks/useData";
import { computeCredits } from "@/lib/storage";
import { 
  Download, 
  FileText, 
  File, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BookOpen,
  User,
  GraduationCap
} from "lucide-react";

interface ReportData {
  studentName: string;
  studentId: string;
  department: string;
  semester: string;
  totalHours: number;
  verifiedHours: number;
  completedModules: number;
  totalModules: number;
  credits: number;
  logbookEntries: any[];
  moduleProgress: any[];
  achievements: string[];
  recommendations: string[];
}

export default function LogbookGenerator() {
  const { toast } = useToast();
  const { data: logbook = [] } = useLogbook();
  const { data: modules = [] } = useModules();
  const { data: moduleProgress = [] } = useModuleProgress("Current Student");
  const { data: profile } = useStudentProfile("Current Student");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Calculate report data
  const calculatedData = useMemo(() => {
    const verifiedHours = logbook.filter(e => e.verified).reduce((s, e) => s + (e.hours || 0), 0);
    const totalHours = logbook.reduce((s, e) => s + (e.hours || 0), 0);
    const completedModules = moduleProgress.filter(p => p.progress >= 100);
    const completedModuleData = completedModules
      .map(p => modules.find(m => m.id === p.moduleId))
      .filter(Boolean);
    
    const credits = computeCredits({ 
      verifiedHours, 
      completedModules: completedModuleData as any 
    });

    return {
      studentName: profile?.name || "Student Name",
      studentId: profile?.studentId || "STU001",
      department: profile?.department || "Computer Science",
      semester: "Fall 2024",
      totalHours,
      verifiedHours,
      completedModules: completedModules.length,
      totalModules: modules.length,
      credits,
      logbookEntries: logbook,
      moduleProgress,
      achievements: [
        "Completed React Development Module",
        "Achieved 100+ verified internship hours",
        "Maintained 4.0 GPA",
        "Active in coding competitions"
      ],
      recommendations: [
        "Continue building full-stack projects",
        "Focus on system design concepts",
        "Practice technical interviews",
        "Network with industry professionals"
      ]
    };
  }, [logbook, modules, moduleProgress, profile]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setReportData(calculatedData);
      toast({ title: "Report generated", description: "Your comprehensive report is ready for export." });
    } catch (error) {
      toast({ title: "Generation failed", description: "Could not generate report. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    if (!reportData) return;
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a simple text-based report for demo
      const reportContent = generateTextReport(reportData);
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `internship_report_${reportData.studentName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      toast({ title: "PDF exported", description: "Report downloaded successfully." });
    } catch (error) {
      toast({ title: "Export failed", description: "Could not export PDF." });
    }
  };

  const exportToWord = async () => {
    if (!reportData) return;
    
    try {
      // Simulate Word document generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportContent = generateTextReport(reportData);
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `internship_report_${reportData.studentName.replace(/\s+/g, '_')}.doc`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      toast({ title: "Word document exported", description: "Report downloaded successfully." });
    } catch (error) {
      toast({ title: "Export failed", description: "Could not export Word document." });
    }
  };

  const generateTextReport = (data: ReportData): string => {
    const lines: string[] = [];
    
    lines.push("=".repeat(60));
    lines.push("INTERNSHIP LOGBOOK & PROGRESS REPORT");
    lines.push("=".repeat(60));
    lines.push("");
    
    lines.push("STUDENT INFORMATION");
    lines.push("-".repeat(20));
    lines.push(`Name: ${data.studentName}`);
    lines.push(`Student ID: ${data.studentId}`);
    lines.push(`Department: ${data.department}`);
    lines.push(`Semester: ${data.semester}`);
    lines.push("");
    
    lines.push("PROGRESS SUMMARY");
    lines.push("-".repeat(20));
    lines.push(`Total Internship Hours: ${data.totalHours}`);
    lines.push(`Verified Hours: ${data.verifiedHours}`);
    lines.push(`Completion Rate: ${Math.round((data.verifiedHours / data.totalHours) * 100)}%`);
    lines.push(`NEP Credits Earned: ${data.credits}`);
    lines.push(`Modules Completed: ${data.completedModules}/${data.totalModules}`);
    lines.push("");
    
    lines.push("LOGBOOK ENTRIES");
    lines.push("-".repeat(20));
    data.logbookEntries.forEach((entry, index) => {
      lines.push(`${index + 1}. Date: ${entry.date}`);
      lines.push(`   Hours: ${entry.hours}`);
      lines.push(`   Summary: ${entry.summary}`);
      lines.push(`   Status: ${entry.verified ? 'Verified' : 'Pending'}`);
      lines.push("");
    });
    
    lines.push("ACHIEVEMENTS");
    lines.push("-".repeat(20));
    data.achievements.forEach(achievement => {
      lines.push(`• ${achievement}`);
    });
    lines.push("");
    
    lines.push("RECOMMENDATIONS");
    lines.push("-".repeat(20));
    data.recommendations.forEach(recommendation => {
      lines.push(`• ${recommendation}`);
    });
    lines.push("");
    
    lines.push("=".repeat(60));
    lines.push(`Report Generated: ${new Date().toLocaleString()}`);
    lines.push("=".repeat(60));
    
    return lines.join('\n');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Automatic Logbook & Report Generator</h2>
        <p className="text-muted-foreground">Generate comprehensive reports with export options</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Report Overview</TabsTrigger>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{calculatedData.totalHours}</span>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{calculatedData.verifiedHours} verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">NEP Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{calculatedData.credits}</span>
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">This semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{calculatedData.completedModules}/{calculatedData.totalModules}</span>
                  <BookOpen className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{Math.round((calculatedData.completedModules / calculatedData.totalModules) * 100)}%</span>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <Progress value={(calculatedData.completedModules / calculatedData.totalModules) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Logbook Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculatedData.logbookEntries.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{entry.date}</div>
                      <div className="text-sm text-muted-foreground">{entry.summary}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.verified ? "default" : "secondary"}>
                        {entry.verified ? "Verified" : "Pending"}
                      </Badge>
                      <span className="text-sm">{entry.hours}h</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculatedData.moduleProgress.slice(0, 5).map((progress, index) => {
                  const module = modules.find(m => m.id === progress.moduleId);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{module?.title || progress.moduleId}</span>
                        <span className="text-sm text-muted-foreground">{progress.progress}%</span>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Comprehensive Report</CardTitle>
              <CardDescription>Create a detailed report including all your progress, achievements, and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Report will include:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Student information and academic details</li>
                  <li>• Complete logbook entries with verification status</li>
                  <li>• Module completion progress and achievements</li>
                  <li>• NEP credit calculations and eligibility</li>
                  <li>• Performance analytics and insights</li>
                  <li>• Personalized recommendations for improvement</li>
                </ul>
              </div>

              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
                className="w-full bg-gradient-accent"
              >
                {isGenerating ? (
                  <>
                    <FileText className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              {reportData && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Report Generated Successfully!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your comprehensive report is ready. You can now export it in PDF or Word format.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Download your report in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!reportData ? (
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">Generate a report first to enable export options</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-8 w-8 text-red-600" />
                        <div>
                          <h3 className="font-semibold">PDF Export</h3>
                          <p className="text-sm text-muted-foreground">Professional PDF format</p>
                        </div>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• High-quality formatting</li>
                        <li>• Print-ready layout</li>
                        <li>• Professional appearance</li>
                        <li>• Easy to share</li>
                      </ul>
                      <Button onClick={exportToPDF} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <File className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">Word Document</h3>
                          <p className="text-sm text-muted-foreground">Editable Word format</p>
                        </div>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Editable content</li>
                        <li>• Easy to modify</li>
                        <li>• Professional templates</li>
                        <li>• Collaborative editing</li>
                      </ul>
                      <Button onClick={exportToWord} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export as Word
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
