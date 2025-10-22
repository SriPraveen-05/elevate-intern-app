import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock as ClockIcon, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentLogbook } from "@/hooks/useData";

interface LogbookEntry {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected';
  feedback?: string;
}

interface LogbookData {
  entries: LogbookEntry[];
}

export default function LogbookViewer() {
  const { data: logbook, isLoading, error } = useStudentLogbook();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !logbook) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
        <h3 className="text-lg font-medium mb-1">Error loading logbook</h3>
        <p className="text-sm text-muted-foreground">
          Unable to load your logbook. Please try again later.
        </p>
      </div>
    );
  }

  const logbookData = logbook as unknown as LogbookData;

  return (
    <div className="space-y-4">
      {logbookData.entries.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-medium">No logbook entries yet</h3>
          <p className="text-sm text-muted-foreground">
            Your mentor will add entries as you progress through your internship.
          </p>
        </div>
      ) : (
        logbookData.entries.map((entry) => (
          <div key={entry.id} className="border rounded-lg p-4 hover:bg-muted/10 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{entry.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {entry.status === 'approved' ? (
                  <span className="inline-flex items-center text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Approved
                  </span>
                ) : entry.status === 'rejected' ? (
                  <span className="inline-flex items-center text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Needs Revision
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    Pending Review
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-foreground/90">{entry.description}</p>
            {entry.feedback && (
              <div className="mt-3 p-3 bg-muted/30 rounded-md border-l-4 border-primary">
                <p className="text-xs font-medium text-muted-foreground mb-1">MENTOR FEEDBACK</p>
                <p className="text-sm">{entry.feedback}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
