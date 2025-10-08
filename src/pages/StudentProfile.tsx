import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStudentProfile, useUpsertStudentProfile } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Award } from "lucide-react";
import { generateId } from "@/lib/storage";

export default function StudentProfile() {
  const { user } = useAuth();
  const userName = user?.name || "";
  const { data: profile } = useStudentProfile(userName);
  const upsertProfile = useUpsertStudentProfile();
  const { toast } = useToast();

  const [department, setDepartment] = useState("");
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState(1);
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [projects, setProjects] = useState<Array<{ id: string; title: string; description: string; technologies: string[]; link?: string }>>([]);
  const [certifications, setCertifications] = useState<Array<{ id: string; name: string; issuer: string; date: string; credentialUrl?: string }>>([]);

  useEffect(() => {
    if (profile) {
      setDepartment(profile.department || "");
      setYear(profile.year || 1);
      setSemester(profile.semester || 1);
      setCgpa(profile.academicDetails?.cgpa?.toString() || "");
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
      setProjects(profile.projects || []);
      setCertifications(profile.certifications || []);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!userName) return;
    await upsertProfile.mutateAsync({
      id: profile?.id || generateId("prof"),
      userName,
      department,
      year,
      semester,
      skills,
      interests,
      projects,
      certifications,
      academicDetails: {
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
      },
    });
    toast({ title: "Saved", description: "Profile updated successfully!" });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const addProject = () => {
    setProjects([...projects, { id: generateId("proj"), title: "", description: "", technologies: [], link: "" }]);
  };

  const updateProject = (id: string, field: string, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const addCertification = () => {
    setCertifications([...certifications, { id: generateId("cert"), name: "", issuer: "", date: "", credentialUrl: "" }]);
  };

  const updateCertification = (id: string, field: string, value: any) => {
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Complete your profile to improve readiness score</p>
          </div>
          <Button onClick={handleSave} className="bg-gradient-accent">
            <Award className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </div>

        {/* Academic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Details</CardTitle>
            <CardDescription>Your educational information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Computer Science" />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} min={1} max={4} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Semester</Label>
                <Input type="number" value={semester} onChange={(e) => setSemester(Number(e.target.value))} min={1} max={8} />
              </div>
              <div className="space-y-2">
                <Label>CGPA (out of 10)</Label>
                <Input type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="e.g., 8.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your technical and soft skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g., React, Python, Communication" onKeyDown={(e) => e.key === "Enter" && addSkill()} />
              <Button onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSkills(skills.filter(s => s !== skill))} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>Areas you're passionate about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="e.g., AI, Web Development" onKeyDown={(e) => e.key === "Enter" && addInterest()} />
              <Button onClick={addInterest}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {interest}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setInterests(interests.filter(int => int !== interest))} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Mini Projects</CardTitle>
                <CardDescription>Showcase your work</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addProject}>
                <Plus className="h-4 w-4 mr-1" /> Add Project
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <Input value={project.title} onChange={(e) => updateProject(project.id, "title", e.target.value)} placeholder="Project Title" className="flex-1 mr-2" />
                  <Button size="sm" variant="ghost" onClick={() => removeProject(project.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea value={project.description} onChange={(e) => updateProject(project.id, "description", e.target.value)} placeholder="Brief description" rows={2} />
                <Input value={project.link} onChange={(e) => updateProject(project.id, "link", e.target.value)} placeholder="GitHub/Live link (optional)" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Add your achievements</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-1" /> Add Certificate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <Input value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} placeholder="Certificate Name" className="flex-1 mr-2" />
                  <Button size="sm" variant="ghost" onClick={() => removeCertification(cert.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} placeholder="Issuer (e.g., Coursera)" />
                  <Input type="date" value={cert.date} onChange={(e) => updateCertification(cert.id, "date", e.target.value)} />
                </div>
                <Input value={cert.credentialUrl} onChange={(e) => updateCertification(cert.id, "credentialUrl", e.target.value)} placeholder="Credential URL (optional)" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="bg-gradient-accent">
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
