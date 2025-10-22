import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, Building2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternshipRecommendations } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InternshipRecommendations() {
  const { user } = useAuth();
  const { data: recommendations, isLoading } = useInternshipRecommendations(user?.id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Complete your profile to get personalized internship recommendations
        </p>
        <Button onClick={() => navigate('/profile')}>
          Update Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.slice(0, 3).map((internship) => (
        <Card key={internship.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{internship.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Building2 className="h-4 w-4 mr-1" />
                  {internship.company}
                </div>
              </div>
              <Badge variant="secondary" className="flex-shrink-0 ml-2">
                {internship.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {internship.skills?.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
              {internship.skills?.length > 3 && (
                <Badge variant="outline" className="text-muted-foreground">
                  +{internship.skills.length - 3} more
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {internship.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {internship.duration}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-primary"
                onClick={() => navigate(`/internships/${internship.id}`)}
              >
                View Details <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center pt-2">
        <Button variant="outline" onClick={() => navigate('/internships')}>
          View All Internships
        </Button>
      </div>
    </div>
  );
}
