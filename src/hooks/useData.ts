import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAfter, parseISO } from "date-fns";

// Extend the StudentApplication type to include missing properties
interface ExtendedStudentApplication extends Omit<StudentApplication, 'internshipTitle'> {
  deadline?: string;
  internshipTitle: string;
}

// Extend the Event type to include missing properties
interface ExtendedEvent extends Omit<Event, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

// Extend the Badge type to include missing properties
interface ExtendedBadge extends Omit<Badge, 'earnedAt'> {
  credits?: number;
  earned: boolean;
  earnedAt?: string;
}

// Industry Profile type
export interface IndustryProfile {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  logo?: string;
  description?: string;
  activeInternships: number;
  totalApplicants: number;
  newApplicants: number;
  hireRate: number;
  hireRateChange: number;
  upcomingEvents: number;
  nextEvent?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Extend the StudentProfile type to include missing properties
interface ExtendedStudentProfile extends Omit<StudentProfile, 'skills'> {
  internshipCredits?: number;
  certificationCredits?: number;
  courseCredits?: number;
  workshopCredits?: number;
  preferredCompanies?: string[];
  preferredLocations?: string[];
  preferredJobTypes?: string[];
  skills?: string[]; // Keep as string[] to match the original type
  skillLevels?: Array<{
    name: string;
    level: number;
  }>;
}

import {
  addLogbookEntry,
  generateId,
  listApplications,
  listLogbook,
  listPostings,
  StudentApplication,
  LogbookEntry,
  InternshipPosting,
  upsertApplication,
  upsertPosting,
  updateApplicationStatus,
  verifyLogbookEntry,
  deletePosting,
  // extended storage
  listModules,
  listModuleProgress,
  upsertModuleProgress,
  computeCredits,
  listCompanyVerifications,
  submitCompanyVerification,
  updateCompanyVerification,
  listNotifications,
  addNotification,
  markNotificationRead,
  SkillModule,
  // mentoring
  listMentors,
  listMentoringSessions,
  requestMentoringSession,
  // profiles
  getStudentProfile,
  upsertStudentProfile,
  StudentProfile,
  // badges
  listBadges,
  awardBadge,
  Badge,
  // events
  listEvents,
  createEvent,
  Event,
  // feedback
  listIndustryFeedback,
  submitIndustryFeedback,
  IndustryFeedback,
  // readiness
  calculateReadinessScore,
} from "@/lib/storage";

export function usePostings() {
  return useQuery({ queryKey: ["postings"], queryFn: listPostings });
}

export function useApplications() {
  return useQuery({ queryKey: ["applications"], queryFn: listApplications });
}

export function useLogbook() {
  return useQuery({ queryKey: ["logbook"], queryFn: listLogbook });
}

export function useCreatePosting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<InternshipPosting, "id" | "postedAt" | "applications">) => {
      const posting: InternshipPosting = {
        ...data,
        id: generateId("post"),
        postedAt: new Date().toISOString(),
        applications: 0,
      };
      upsertPosting(posting);
      return Promise.resolve(posting);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["postings"] });
    }
  });
}

export function useDeletePosting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      deletePosting(id);
      return Promise.resolve(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["postings"] })
  });
}

export function useApprovePosting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const all = listPostings();
      const p = all.find(x => x.id === id);
      if (p) {
        upsertPosting({ ...p, verified: true });
      }
      return Promise.resolve(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["postings"] })
  });
}

export function useApplyToInternship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<StudentApplication, "id" | "createdAt">) => {
      const app: StudentApplication = {
        ...data,
        id: generateId("app"),
        createdAt: new Date().toISOString(),
      };
      upsertApplication(app);
      // increment applications count on posting
      const all = listPostings();
      const p = all.find(x => x.id === data.internshipId);
      if (p) upsertPosting({ ...p, applications: (p.applications ?? 0) + 1 });
      return Promise.resolve(app);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["postings"] });
    }
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StudentApplication["status"]; }) => {
      updateApplicationStatus(id, status);
      return Promise.resolve({ id, status });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] })
  });
}

export function useAddLogbookEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LogbookEntry, "id">) => {
      const entry: LogbookEntry = { ...data, id: generateId("log") };
      addLogbookEntry(entry);
      return Promise.resolve(entry);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logbook"] })
  });
}

export function useVerifyLogbookEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      verifyLogbookEntry(id);
      return Promise.resolve(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logbook"] })
  });
}

// ---------- Modules & Credits ----------
export function useModules() {
  return useQuery({ queryKey: ["modules"], queryFn: listModules });
}

export function useModuleProgress(userName: string | undefined) {
  return useQuery({
    queryKey: ["moduleProgress", userName ?? "anon"],
    queryFn: () => listModuleProgress(userName ?? ""),
    enabled: !!userName,
  });
}

export function useUpsertModuleProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { userName: string; moduleId: string; progress: number; completedAt?: string }) => {
      upsertModuleProgress(data);
      return Promise.resolve(data);
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["moduleProgress", vars.userName] });
    }
  });
}

export function useCredits(args: { userName: string | undefined; verifiedHours: number }) {
  const { data: modules = [] } = useModules();
  const { data: progress = [] } = useModuleProgress(args.userName ?? "");
  const completedModules: SkillModule[] = useMemo(() => {
    const set = new Set(progress.filter(p => p.progress >= 100).map(p => p.moduleId));
    return modules.filter(m => set.has(m.id));
  }, [modules, progress]);
  const credits = useMemo(() => computeCredits({ verifiedHours: args.verifiedHours, completedModules }), [args.verifiedHours, completedModules]);
  return credits;
}

// ---------- Company Verification ----------
export function useCompanyVerifications() {
  return useQuery({ queryKey: ["companyVerifications"], queryFn: listCompanyVerifications });
}

export function useSubmitCompanyVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { companyName: string; contactName: string; email: string }) => Promise.resolve(submitCompanyVerification(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companyVerifications"] })
  });
}

export function useUpdateCompanyVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: "pending" | "approved" | "rejected" }) => {
      updateCompanyVerification(vars.id, vars.status);
      return Promise.resolve(vars);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companyVerifications"] })
  });
}

// ---------- Notifications ----------
export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: listNotifications });
}

export function useAddNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (n: { userRole?: "student" | "faculty" | "admin" | "industry"; title: string; body: string }) => Promise.resolve(addNotification(n)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => { markNotificationRead(id); return Promise.resolve(id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
  });
}

// ---------- Mentoring ----------
export function useMentors() {
  return useQuery({ queryKey: ["mentors"], queryFn: listMentors });
}

export function useMentoringSessions(userName?: string) {
  return useQuery({ queryKey: ["mentoringSessions", userName ?? "all"], queryFn: () => listMentoringSessions(userName), enabled: true });
}

export function useRequestMentoringSession() {
  const qc = useQueryClient();
  return useMutation({
  });
}

// ---------- Industry Profile Hooks ----------

export function useIndustryProfile(userId?: string) {
  return useQuery({
    queryKey: ["industryProfile", userId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in a real app, this would be fetched from an API
      return {
        id: userId || 'industry-1',
        companyName: 'TechCorp',
        industry: 'Technology',
        website: 'https://techcorp.example.com',
        description: 'Leading technology solutions provider',
        activeInternships: 5,
        totalApplicants: 124,
        newApplicants: 12,
        hireRate: 68,
        hireRateChange: 12,
        upcomingEvents: 3,
        nextEvent: 'Campus Recruitment - Nov 15',
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as IndustryProfile;
    },
    enabled: !!userId,
  });
}

// ---------- Student Dashboard Hooks ----------

export function useUpcomingDeadlines(userId?: string) {
  const { data: applications = [] } = useApplications() as { data: ExtendedStudentApplication[] };
  const { data: events = [] } = useEvents() as { data: ExtendedEvent[] };
  
  return useQuery({
    queryKey: ["upcomingDeadlines", userId],
    queryFn: async () => {
      // Simulate API call with combined data
      const applicationDeadlines = applications
        .filter(app => app.studentName === userId && app.status === 'pending')
        .map(app => ({
          id: `app-${app.id}`,
          title: `Application: ${app.internshipTitle}`,
          type: 'application' as const,
          dueDate: app.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
          status: 'pending' as const,
          link: `/applications/${app.id}`
        }));

      const eventDeadlines = events
        .filter(event => isAfter(parseISO(event.endDate), new Date()))
        .map(event => ({
          id: `event-${event.id}`,
          title: event.title,
          type: 'event' as const,
          dueDate: event.startDate,
          status: 'pending' as const,
          link: `/events/${event.id}`
        }));

      return [...applicationDeadlines, ...eventDeadlines]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 10); // Return top 10 upcoming deadlines
    },
    enabled: !!userId,
  });
}

export function useStudentCredits(userId?: string) {
  const { data: profile } = useStudentProfile(userId) as { data: ExtendedStudentProfile | undefined };
  const { data: badges = [] } = useBadges(userId) as { data: ExtendedBadge[] };
  
  return useQuery({
    queryKey: ["studentCredits", userId],
    queryFn: async () => {
      // Calculate credits based on profile and badges
      const earnedBadges = badges.filter((badge: ExtendedBadge) => badge.earned);
      const credits = earnedBadges.reduce((sum: number, badge: ExtendedBadge) => sum + (badge.credits || 0), 0);
      
      return {
        internship: {
          earned: profile?.internshipCredits || 0,
          total: 20, // Example: 20 credits needed for internship completion
        },
        certifications: {
          earned: profile?.certificationCredits || 0,
          total: 10, // Example: 10 credits needed for certifications
        },
        courses: {
          earned: profile?.courseCredits || 0,
          total: 15, // Example: 15 credits needed for courses
        },
        workshops: {
          earned: profile?.workshopCredits || 0,
          total: 5, // Example: 5 credits needed for workshops
        },
        totalEarned: credits,
        totalPossible: 50, // Sum of all credit requirements
        level: Math.floor(credits / 10) + 1, // Level up every 10 credits
        nextLevelProgress: (credits % 10) * 10, // Progress to next level (0-100%)
      };
    },
    enabled: !!userId,
  });
}

export function useStudentSkills(userId?: string) {
  const { data: profile } = useStudentProfile(userId) as { data: ExtendedStudentProfile | undefined };
  const { data: modules = [] } = useModules();
  const { data: progress = [] } = useModuleProgress(userId);

  return useQuery({
    queryKey: ["studentSkills", userId],
    queryFn: async () => {
      // Map module progress to skills with completion status
      const skills = new Map<string, {
        id: string;
        name: string;
        category: string;
        progress: number;
        target: number;
        lastPracticed?: string;
        resources: number;
      }>();

      // Process each module progress
      progress.forEach((p: any) => {
        const mod = modules.find((m: SkillModule) => m.id === p.moduleId);
        if (mod) {
          const category = 'General'; // Default category since SkillModule doesn't have category
          const skillName = mod.title.split(' ')[0]; // Use first word of title as skill name
          const skillId = `${category}-${skillName}`.toLowerCase();
          
          const existing = skills.get(skillId) || {
            id: skillId,
            name: skillName,
            category,
            progress: 0,
            target: 100, // Default target
            resources: 0,
          };
          
          skills.set(skillId, {
            ...existing,
            progress: Math.max(existing.progress, p.progress || 0),
            resources: existing.resources + 1,
            lastPracticed: p.updatedAt || p.createdAt,
          });
        }
      });

      return Array.from(skills.values()).sort((a, b) => b.progress - a.progress);
    },
    enabled: !!userId,
  });
}

export function useInternshipRecommendations(userId?: string) {
  const { data: profile } = useStudentProfile(userId) as { data: ExtendedStudentProfile | undefined };
  const { data: postings = [] } = usePostings();
  const { data: skills = [] } = useStudentSkills(userId);
  
  return useQuery({
    queryKey: ["internshipRecommendations", userId],
    queryFn: async () => {
      if (!profile?.skills?.length || !skills?.length) return [];
      
      // Get the user's top skills (by progress)
      const userSkillNames = new Set(
        [...skills]
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 5)
          .map(skill => skill.name.toLowerCase())
      );
      
      // Score postings based on skill match and other factors
      const scoredPostings = postings.map((posting: any) => {
        const postingSkills = posting.skills || [];
        const matchedSkills = postingSkills.filter((skill: string) => 
          userSkillNames.has(skill.toLowerCase())
        );
        
        // Simple scoring algorithm - can be enhanced
        const skillMatchScore = (matchedSkills.length / Math.max(1, postingSkills.length)) * 50;
        const companyMatchScore = profile.preferredCompanies?.includes(posting.company) ? 20 : 0;
        const locationScore = profile.preferredLocations?.includes(posting.location) ? 15 : 0;
        const typeScore = profile.preferredJobTypes?.includes(posting.type) ? 15 : 0;
        
        return {
          ...posting,
          score: skillMatchScore + companyMatchScore + locationScore + typeScore,
          matchedSkills,
        };
      });
      
      // Sort by score and return top 5
      return scoredPostings
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 5);
    },
    enabled: !!userId && !!profile?.skills,
  });
}

// ---------- Student Profiles ----------

export function useStudentProfile(userName: string | undefined) {
  return useQuery({
    queryKey: ["profile", userName ?? "anon"],
    queryFn: () => {
      if (!userName) throw new Error("Username is required");
      const profile = getStudentProfile(userName);
      if (!profile) {
        // Create a default profile if not found
        const newProfile: StudentProfile = {
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
        upsertStudentProfile(newProfile);
        return newProfile;
      }
      return profile;
    },
    enabled: !!userName,
  });
}

// ---------- Student Logbook Hooks ----------

export function useStudentLogbook(userId?: string) {
  return useQuery({
    queryKey: ["studentLogbook", userId],
    queryFn: () => {
      if (!userId) return null;
      // Simulated logbook data - replace with actual API call
      return {
        entries: [
          {
            id: '1',
            title: 'Week 1 - Project Setup',
            date: new Date().toISOString(),
            description: 'Set up the development environment and initialized the project repository.',
            status: 'approved' as const,
            feedback: 'Good job on setting up the environment!'
          },
          {
            id: '2',
            title: 'Week 2 - Feature Implementation',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Implemented the main features for the user authentication module.',
            status: 'pending' as const,
            feedback: ''
          }
        ]
      };
    },
    enabled: !!userId,
  });
}

// ---------- Eligible Internships Hooks ----------

export function useEligibleInternships(userId?: string) {
  return useQuery({
    queryKey: ["eligibleInternships", userId],
    queryFn: () => {
      if (!userId) return [];
      // Simulated data - replace with actual API call
      return [
        {
          id: '1',
          title: 'Frontend Developer Intern',
          company: 'Tech Corp',
          duration: '6 months',
          eligible: true,
          notes: 'Eligible for 6 credits upon completion',
          status: 'approved' as const
        },
        {
          id: '2',
          title: 'Backend Developer Intern',
          company: 'Data Systems Inc',
          duration: '3 months',
          eligible: false,
          notes: 'Requires additional coursework in databases',
          status: 'rejected' as const
        },
        {
          id: '3',
          title: 'Full Stack Developer Intern',
          company: 'Web Solutions Ltd',
          duration: '4 months',
          eligible: true,
          notes: 'Eligible for 4 credits, pending advisor approval',
          status: 'pending' as const
        }
      ];
    },
    enabled: !!userId,
  });
}

export function useUpsertStudentProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: StudentProfile) => Promise.resolve(upsertStudentProfile(profile)),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["profile", vars.userName] })
  });
}

// ---------- Badges ----------
export function useBadges(userName?: string) {
  return useQuery({
    queryKey: ["badges", userName ?? "all"],
    queryFn: () => listBadges(userName),
  });
}

export function useAwardBadge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Badge, "id" | "earnedAt">) => Promise.resolve(awardBadge(data)),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["badges", vars.userName] })
  });
}

// ---------- Events ----------
export function useEvents() {
  return useQuery({ queryKey: ["events"], queryFn: listEvents });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (event: Omit<Event, "id" | "postedAt">) => Promise.resolve(createEvent(event)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] })
  });
}

// ---------- Industry Feedback ----------
export function useIndustryFeedback() {
  return useQuery({ queryKey: ["industryFeedback"], queryFn: listIndustryFeedback });
}

export function useSubmitIndustryFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (feedback: Omit<IndustryFeedback, "id" | "submittedAt">) => Promise.resolve(submitIndustryFeedback(feedback)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["industryFeedback"] })
  });
}


