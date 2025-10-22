import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, BookOpen, Clock, Zap, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentCredits } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type CreditCategory = {
  id: string;
  name: string;
  earned: number;
  total: number;
  icon: React.ReactNode;
  color: string;
};

export default function CreditsEarned() {
  const { user } = useAuth();
  const { data: credits, isLoading } = useStudentCredits(user?.id);
  const navigate = useNavigate();

  const categories: CreditCategory[] = [
    {
      id: 'internship',
      name: 'Internship',
      earned: credits?.internship?.earned || 0,
      total: credits?.internship?.total || 0,
      icon: <Briefcase className="h-4 w-4" />,
      color: 'bg-blue-500',
    },
    {
      id: 'certifications',
      name: 'Certifications',
      earned: credits?.certifications?.earned || 0,
      total: credits?.certifications?.total || 0,
      icon: <Award className="h-4 w-4" />,
      color: 'bg-purple-500',
    },
    {
      id: 'courses',
      name: 'Courses',
      earned: credits?.courses?.earned || 0,
      total: credits?.courses?.total || 0,
      icon: <BookOpen className="h-4 w-4" />,
      color: 'bg-green-500',
    },
    {
      id: 'workshops',
      name: 'Workshops',
      earned: credits?.workshops?.earned || 0,
      total: credits?.workshops?.total || 0,
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-yellow-500',
    },
  ];

  const totalEarned = categories.reduce((sum, cat) => sum + cat.earned, 0);
  const totalPossible = categories.reduce((sum, cat) => sum + cat.total, 0);
  const progress = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
  const remaining = totalPossible - totalEarned;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-3">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Trophy className="h-12 w-12 text-amber-400" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                {totalEarned}
              </span>
            </div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-amber-400"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Total Credits Earned</h3>
        <p className="text-sm text-muted-foreground">
          {remaining} credits remaining to complete your goal
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Credit Breakdown</h4>
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile/credits')}>
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className={`${category.color} p-1 rounded-full mr-2`}>
                    {category.icon}
                  </div>
                  <span>{category.name}</span>
                </div>
                <span className="font-medium">
                  {category.earned}/{category.total}
                </span>
              </div>
              <Progress 
                value={(category.earned / (category.total || 1)) * 100} 
                className="h-2"
                indicatorClassName={category.color.replace('bg-', 'bg-opacity-100 ')}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-start">
          <Zap className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-2" />
          <div>
            <h4 className="font-medium text-sm">Need more credits?</h4>
            <p className="text-sm text-muted-foreground">
              Complete additional certifications or attend workshops to earn more credits.
            </p>
            <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-blue-600 dark:text-blue-400">
              Explore Opportunities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
