import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudentSkills } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

type Skill = {
  id: string;
  name: string;
  category: string;
  progress: number;
  target: number;
  lastPracticed?: string;
  resources: number;
};

const SkillProgress = ({ skill }: { skill: Skill }) => {
  const progressPercentage = (skill.progress / skill.target) * 100;
  
  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">{skill.name}</div>
        <div className="text-xs text-muted-foreground">
          {skill.progress}/{skill.target} hours
        </div>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <BookOpen className="h-3 w-3 mr-1" />
          <span>{skill.resources} resources</span>
        </div>
        {skill.lastPracticed && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last practiced: {skill.lastPracticed}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function LearningTracker() {
  const { user } = useAuth();
  const { data: skills, isLoading } = useStudentSkills(user?.id);
  const navigate = useNavigate();

  const categories = skills?.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-32" />
            {[...Array(2)].map((_, j) => (
              <div key={j} className="space-y-2 p-3 border rounded-lg">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <div className="text-center py-6 space-y-4">
        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">No skills being tracked</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add skills to track your learning progress and access recommended resources.
        </p>
        <Button onClick={() => navigate('/profile/skills')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skills
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Skill Development</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {Object.entries(categories).map(([category, categorySkills]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
            <Badge variant="outline" className="text-xs">
              {categorySkills.length} skills
            </Badge>
          </div>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              {categorySkills.slice(0, 2).map((skill) => (
                <SkillProgress key={skill.id} skill={skill} />
              ))}
              
              {categorySkills.length > 2 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => navigate(`/learning?category=${encodeURIComponent(category)}`)}
                >
                  +{categorySkills.length - 2} more skills in {category}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ))}

      <div className="pt-2">
        <Button variant="outline" className="w-full" onClick={() => navigate('/learning/resources')}>
          <BookOpen className="h-4 w-4 mr-2" />
          View Recommended Resources
        </Button>
      </div>
    </div>
  );
}
