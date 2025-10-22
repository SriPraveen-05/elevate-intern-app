import { useQuery } from "@tanstack/react-query";
import { listPostings } from "@/lib/storage";

export function useEligibleInternships(studentId?: string) {
  return useQuery({
    queryKey: ["eligibleInternships", studentId],
    queryFn: () => {
      // In a real app, we would filter based on student's eligibility
      // For now, return all postings
      return listPostings();
    },
    enabled: !!studentId,
  });
}
