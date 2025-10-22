import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingDeadlines } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";
import { format, isToday, isTomorrow, isPast, differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

type Deadline = {
  id: string;
  title: string;
  type: 'application' | 'assignment' | 'meeting' | 'other';
  dueDate: Date | string;
  course?: string;
  status: 'pending' | 'submitted' | 'missed';
  link?: string;
};

export default function UpcomingDeadlines() {
  const { user } = useAuth();
  const { data: deadlines, isLoading } = useUpcomingDeadlines(user?.id);
  const navigate = useNavigate();

  const formatDueDate = (date: Date | string) => {
    const d = new Date(date);
    
    if (isToday(d)) {
      return 'Today';
    }
    
    if (isTomorrow(d)) {
      return 'Tomorrow';
    }
    
    const diff = differenceInDays(d, new Date());
    
    if (diff < 7) {
      return `In ${diff} day${diff > 1 ? 's' : ''}`;
    }
    
    return format(d, 'MMM d, yyyy');
  };

  const getStatusVariant = (deadline: Deadline) => {
    if (deadline.status === 'submitted') return 'success';
    if (deadline.status === 'missed') return 'destructive';
    
    const dueDate = new Date(deadline.dueDate);
    if (isPast(dueDate)) return 'destructive';
    
    const diff = differenceInDays(new Date(dueDate), new Date());
    if (diff <= 1) return 'warning';
    
    return 'default';
  };

  const getStatusIcon = (deadline: Deadline) => {
    if (deadline.status === 'submitted') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (deadline.status === 'missed') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    
    const dueDate = new Date(deadline.dueDate);
    if (isPast(dueDate)) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    
    const diff = differenceInDays(new Date(dueDate), new Date());
    if (diff <= 1) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      application: { label: 'Application', variant: 'default' },
      assignment: { label: 'Assignment', variant: 'secondary' },
      meeting: { label: 'Meeting', variant: 'outline' },
      other: { label: 'Other', variant: 'outline' },
    };
    
    const { label, variant } = typeMap[type] || { label: type, variant: 'outline' };
    return <Badge variant={variant} className="text-xs">{label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!deadlines || deadlines.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">No upcoming deadlines</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You're all caught up! Check back later for new deadlines.
        </p>
        <Button variant="outline" onClick={() => navigate('/internships')}>
          Browse Internships
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deadlines.slice(0, 5).map((deadline) => (
        <div 
          key={deadline.id} 
          className="flex items-start p-4 border rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="flex-shrink-0 mr-4 mt-0.5">
            {getStatusIcon(deadline)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {deadline.title}
              </h4>
              {getTypeBadge(deadline.type)}
            </div>
            
            {deadline.course && (
              <p className="text-sm text-muted-foreground">{deadline.course}</p>
            )}
            
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(deadline.dueDate), 'MMM d, yyyy')}</span>
              <span className="mx-2">•</span>
              <span className={getStatusVariant(deadline) === 'destructive' ? 'text-red-500' : ''}>
                {formatDueDate(deadline.dueDate)}
              </span>
            </div>
          </div>
          
          {deadline.link && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 ml-2"
              onClick={() => window.open(deadline.link, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      {deadlines.length > 5 && (
        <div className="text-center pt-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
            View All Deadlines
          </Button>
        </div>
      )}
    </div>
  );
}
