import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock as ClockIcon, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEligibleInternships } from "@/hooks/useData";

interface EligibleInternship {
  id: string;
  title: string;
  company: string;
  duration: string;
  eligible: boolean;
  notes: string;
  status: 'approved' | 'pending' | 'rejected';
}

export default function CreditTransferEligibility() {
  const { data: eligibleInternships = [], isLoading, error } = useEligibleInternships();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Transfer Eligibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Transfer Eligibility</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
          <h3 className="text-lg font-medium mb-1">Error loading eligibility information</h3>
          <p className="text-sm text-muted-foreground">
            Unable to load credit transfer information. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (eligibleInternships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Transfer Eligibility</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
          <h3 className="font-medium">No eligible internships found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
            Once you complete an internship, your mentor can submit it for credit transfer approval.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Transfer Eligibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg border border-blue-100">
            <p>Eligible internships can be transferred for academic credit. Your advisor will review and approve credit transfers based on your program requirements.</p>
          </div>
          
          {eligibleInternships.map((internship: EligibleInternship) => (
            <div key={internship.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-base">{internship.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {internship.company} • {internship.duration}
                  </p>
                </div>
                <div>
                  {internship.eligible ? (
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      Eligible
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Not Eligible
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="mt-3 text-sm text-foreground/90">{internship.notes}</p>
              
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <div className="flex items-center text-sm">
                  {internship.status === 'approved' ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      Approved for Credit
                    </span>
                  ) : internship.status === 'rejected' ? (
                    <span className="inline-flex items-center text-red-600">
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Not Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-amber-600">
                      <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
                      Pending Review
                    </span>
                  )}
                </div>
                
                {internship.status === 'approved' && (
                  <span className="text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full">
                    Credits: {internship.duration.includes('6') ? '6' : '3'} awarded
                  </span>
                )}
              </div>
              
              {internship.status === 'pending' && (
                <div className="mt-2 text-xs text-amber-600 flex items-center">
                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                  <span>Pending approval from academic advisor</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
