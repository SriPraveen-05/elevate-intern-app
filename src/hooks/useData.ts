import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    mutationFn: (data: { studentName: string; mentorId: string; time: string }) => Promise.resolve(requestMentoringSession(data)),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["mentoringSessions", vars.studentName] })
  });
}

// ---------- Student Profiles ----------
export function useStudentProfile(userName: string | undefined) {
  return useQuery({
    queryKey: ["profile", userName ?? "anon"],
    queryFn: () => getStudentProfile(userName ?? ""),
    enabled: !!userName,
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


