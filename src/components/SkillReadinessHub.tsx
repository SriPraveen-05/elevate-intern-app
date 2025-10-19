import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  BookOpen, 
  Lightbulb, 
  Download, 
  FileText, 
  Video, 
  Link, 
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'course';
  url: string;
  department: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  rating?: number;
}

interface SkillRecommendation {
  skill: string;
  resources: Resource[];
  matchScore: number;
  reason: string;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'React Fundamentals Course',
    description: 'Complete guide to React development with hands-on projects',
    type: 'course',
    url: '/resources/react-fundamentals',
    department: 'Computer Science',
    uploadedBy: 'Dr. Smith',
    uploadedAt: '2024-01-15',
    tags: ['React', 'JavaScript', 'Frontend'],
    difficulty: 'beginner',
    duration: '4 weeks',
    rating: 4.8
  },
  {
    id: '2',
    title: 'System Design Interview Prep',
    description: 'Comprehensive guide to system design concepts and interview preparation',
    type: 'document',
    url: '/resources/system-design.pdf',
    department: 'Computer Science',
    uploadedBy: 'Prof. Johnson',
    uploadedAt: '2024-01-10',
    tags: ['System Design', 'Architecture', 'Interview'],
    difficulty: 'intermediate',
    duration: '2 weeks',
    rating: 4.9
  },
  {
    id: '3',
    title: 'Python Data Science Workshop',
    description: 'Hands-on workshop covering pandas, numpy, and machine learning basics',
    type: 'video',
    url: '/resources/python-ds-workshop.mp4',
    department: 'Data Science',
    uploadedBy: 'Dr. Brown',
    uploadedAt: '2024-01-08',
    tags: ['Python', 'Data Science', 'Machine Learning'],
    difficulty: 'intermediate',
    duration: '3 hours',
    rating: 4.7
  }
];

export default function SkillReadinessHub() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([]);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'document' as Resource['type'],
    url: '',
    department: '',
    tags: '',
    difficulty: 'beginner' as Resource['difficulty']
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.description || !uploadForm.url) {
      toast({ title: "Missing fields", description: "Please fill in title, description, and URL." });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newResource: Resource = {
        id: `resource_${Date.now()}`,
        ...uploadForm,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString(),
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        rating: 0
      };

      setResources(prev => [newResource, ...prev]);
      setUploadForm({
        title: '',
        description: '',
        type: 'document',
        url: '',
        department: '',
        tags: '',
        difficulty: 'beginner'
      });
      
      toast({ title: "Resource uploaded", description: "Your resource has been added to the hub." });
    } catch (error) {
      toast({ title: "Upload failed", description: "Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      // Simulate AI recommendation generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: SkillRecommendation[] = [
        {
          skill: 'React Development',
          resources: resources.filter(r => r.tags.includes('React')),
          matchScore: 95,
          reason: 'Based on your completed modules and internship applications'
        },
        {
          skill: 'System Design',
          resources: resources.filter(r => r.tags.includes('System Design')),
          matchScore: 87,
          reason: 'High demand in your target companies'
        },
        {
          skill: 'Python Data Science',
          resources: resources.filter(r => r.tags.includes('Python')),
          matchScore: 78,
          reason: 'Complementary to your current skill set'
        }
      ];

      setRecommendations(mockRecommendations);
      toast({ title: "Recommendations generated", description: "AI has analyzed your profile and generated personalized recommendations." });
    } catch (error) {
      toast({ title: "Error", description: "Could not generate recommendations." });
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'course': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Skill Readiness Hub</h2>
        <p className="text-muted-foreground">AI-powered learning resources and recommendations</p>
      </div>

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Learning Resources</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="upload">Upload Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getResourceIcon(resource.type)}
                      <div>
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                      )}
                      <Badge className={getDifficultyColor(resource.difficulty)}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {resource.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {resource.duration || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Access
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
              <p className="text-sm text-muted-foreground">Personalized learning paths based on your profile</p>
            </div>
            <Button onClick={generateRecommendations} className="bg-gradient-accent">
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{rec.skill}</h3>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{rec.matchScore}%</div>
                        <div className="text-xs text-muted-foreground">Match Score</div>
                      </div>
                    </div>

                    <Progress value={rec.matchScore} className="h-2 mb-4" />

                    <div className="space-y-2">
                      <h4 className="font-medium">Recommended Resources:</h4>
                      {rec.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getResourceIcon(resource.type)}
                            <div>
                              <div className="font-medium">{resource.title}</div>
                              <div className="text-sm text-muted-foreground">{resource.description}</div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Access
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">Generate AI-powered recommendations based on your profile and goals</p>
                <Button onClick={generateRecommendations} className="bg-gradient-accent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Learning Resource
              </CardTitle>
              <CardDescription>Share educational resources with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resource Title</label>
                  <Input 
                    placeholder="Enter resource title" 
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input 
                    placeholder="e.g., Computer Science" 
                    value={uploadForm.department}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Describe the resource and its learning objectives" 
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resource Type</label>
                  <select 
                    className="w-full border rounded-md h-10 px-3 bg-background"
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value as Resource['type'] }))}
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                    <option value="course">Course</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <select 
                    className="w-full border rounded-md h-10 px-3 bg-background"
                    value={uploadForm.difficulty}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, difficulty: e.target.value as Resource['difficulty'] }))}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resource URL</label>
                <Input 
                  placeholder="https://example.com/resource" 
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input 
                  placeholder="React, JavaScript, Frontend" 
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full bg-gradient-accent"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
