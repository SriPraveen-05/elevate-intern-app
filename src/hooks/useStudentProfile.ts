import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "@/lib/storage";

export function useStudentProfile(userName: string | undefined) {
  return useQuery({
    queryKey: ["profile", userName || 'anon'],
    queryFn: () => {
      if (!userName) throw new Error("Username is required");
      const profile = getStudentProfile(userName);
      if (!profile) {
        // Create a default profile if not found
        const newProfile = {
          id: `user-${Date.now()}`,
          userName,
          department: 'Computer Science',
          year: 3,
          semester: 6,
          skills: [],
          interests: [],
          projects: [],
          certifications: [],
          academicDetails: {
            cgpa: 8.5,
            percentage: 85,
            major: 'Computer Science'
          },
          upcomingDeadlines: []
        };
        // Save the new profile
        getStudentProfile(userName);
        return newProfile;
      }
      return profile;
    },
    enabled: !!userName,
  });
}
