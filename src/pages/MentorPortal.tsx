import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import MentorDashboard from "@/components/mentor/MentorDashboard";

export default function MentorPortal() {
  const { user } = useAuth();

  // In a real app, you would fetch mentor data here
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return <MentorDashboard />;
}
