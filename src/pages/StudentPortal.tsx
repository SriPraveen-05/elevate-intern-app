import { useAuth } from "@/context/AuthContext";
import { useStudentProfile } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";
import StudentDashboard from "@/components/student/StudentDashboard";

const StudentPortal = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useStudentProfile(user?.id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return <StudentDashboard />;
};

export default StudentPortal;
