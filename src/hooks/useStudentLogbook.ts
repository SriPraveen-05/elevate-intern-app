import { useQuery } from "@tanstack/react-query";
import { listLogbook } from "@/lib/storage";

export function useStudentLogbook(studentId?: string) {
  return useQuery({
    queryKey: ["logbook", studentId],
    queryFn: () => {
      if (!studentId) return [];
      const entries = listLogbook();
      return entries.filter(entry => entry.studentName === studentId);
    },
    enabled: !!studentId,
  });
}
