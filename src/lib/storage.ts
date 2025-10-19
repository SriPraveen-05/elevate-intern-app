export type InternshipPosting = {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  verified: boolean;
  skills: string[];
  stipend?: string;
  description?: string;
  postedAt: string;
  applications: number;
};

export type StudentApplication = {
  id: string;
  studentName: string;
  internshipId: string;
  status: "pending" | "accepted" | "rejected" | "shortlisted";
  internshipTitle: string;
  company: string;
  appliedAt: string;
  readinessScore?: number;
  rejectionReason?: string;
  rejectionCategory?: "skills" | "experience" | "location" | "other";
  createdAt: string;
};

export type LogbookEntry = {
  id: string;
  date: string; // ISO
  hours: number;
  summary: string;
  verified: boolean;
  studentName?: string;
};

export const STORAGE_KEYS = {
  postings: "app.postings",
  applications: "app.applications",
  logbook: "app.logbook",
  modules: "app.modules",
  moduleProgress: "app.moduleProgress",
  companyVerifications: "app.companyVerifications",
  notifications: "app.notifications",
  mentors: "app.mentors",
  mentoringSessions: "app.mentoringSessions",
  studentProfiles: "app.studentProfiles",
  badges: "app.badges",
  events: "app.events",
  industryFeedback: "app.industryFeedback",
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  // Notify same-tab listeners as well as cross-tab via 'storage' event
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('data-change', { detail: { key } }));
    }
  } catch {}
}

export function listPostings(): InternshipPosting[] {
  return readJson<InternshipPosting[]>(STORAGE_KEYS.postings, []);
}

export function upsertPosting(posting: InternshipPosting): void {
  const all = listPostings();
  const idx = all.findIndex(p => p.id === posting.id);
  if (idx >= 0) all[idx] = posting; else all.unshift(posting);
  writeJson(STORAGE_KEYS.postings, all);
}

export function deletePosting(id: string): void {
  const all = listPostings().filter(p => p.id !== id);
  writeJson(STORAGE_KEYS.postings, all);
}

export function listApplications(): StudentApplication[] {
  return readJson<StudentApplication[]>(STORAGE_KEYS.applications, []);
}

export function upsertApplication(app: StudentApplication): void {
  const all = listApplications();
  const idx = all.findIndex(a => a.id === app.id);
  if (idx >= 0) all[idx] = app; else all.unshift(app);
  writeJson(STORAGE_KEYS.applications, all);
}

export function updateApplicationStatus(id: string, status: StudentApplication["status"]): void {
  const all = listApplications();
  const idx = all.findIndex(a => a.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], status };
    writeJson(STORAGE_KEYS.applications, all);
  }
}

export function listLogbook(): LogbookEntry[] {
  return readJson<LogbookEntry[]>(STORAGE_KEYS.logbook, []);
}

export function addLogbookEntry(entry: LogbookEntry): void {
  const all = listLogbook();
  all.unshift(entry);
  writeJson(STORAGE_KEYS.logbook, all);
}

export function verifyLogbookEntry(id: string): void {
  const all = listLogbook();
  const idx = all.findIndex(e => e.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], verified: true };
    writeJson(STORAGE_KEYS.logbook, all);
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

// ---------- Skill Modules ----------
export type SkillModule = {
  id: string;
  title: string;
  description: string;
  points: number; // credit points
};

export type ModuleProgress = {
  userName: string; // simplified until real auth userId
  moduleId: string;
  progress: number; // 0-100
  completedAt?: string;
};

export function listModules(): SkillModule[] {
  const seeded = readJson<SkillModule[]>(STORAGE_KEYS.modules, []);
  if (seeded.length) return seeded;
  const defaults: SkillModule[] = [
    { id: generateId('mod'), title: 'Communication Skills', description: 'Improve professional communication', points: 2 },
    { id: generateId('mod'), title: 'Technical Interview Prep', description: 'Data structures and systems', points: 3 },
    { id: generateId('mod'), title: 'Professional Ethics', description: 'Workplace ethics and conduct', points: 1 },
  ];
  writeJson(STORAGE_KEYS.modules, defaults);
  return defaults;
}

export function listModuleProgress(userName: string): ModuleProgress[] {
  return readJson<ModuleProgress[]>(STORAGE_KEYS.moduleProgress, []).filter(m => m.userName === userName);
}

export function listAllModuleProgress(): ModuleProgress[] {
  return readJson<ModuleProgress[]>(STORAGE_KEYS.moduleProgress, []);
}

export function upsertModuleProgress(entry: ModuleProgress): void {
  const all = readJson<ModuleProgress[]>(STORAGE_KEYS.moduleProgress, []);
  const idx = all.findIndex(e => e.userName === entry.userName && e.moduleId === entry.moduleId);
  if (idx >= 0) all[idx] = entry; else all.push(entry);
  writeJson(STORAGE_KEYS.moduleProgress, all);
}

// ---------- Company Verification ----------
export type CompanyVerification = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
};

export function listCompanyVerifications(): CompanyVerification[] {
  return readJson<CompanyVerification[]>(STORAGE_KEYS.companyVerifications, []);
}

export function submitCompanyVerification(data: Omit<CompanyVerification, 'id' | 'status' | 'submittedAt'>): CompanyVerification {
  const entry: CompanyVerification = { id: generateId('cv'), status: 'pending', submittedAt: new Date().toISOString(), ...data };
  const all = listCompanyVerifications();
  all.unshift(entry);
  writeJson(STORAGE_KEYS.companyVerifications, all);
  return entry;
}

export function updateCompanyVerification(id: string, status: CompanyVerification['status']): void {
  const all = listCompanyVerifications();
  const idx = all.findIndex(v => v.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], status };
    writeJson(STORAGE_KEYS.companyVerifications, all);
  }
}

// ---------- Notifications ----------
export type Notification = {
  id: string;
  userRole?: 'student' | 'faculty' | 'admin' | 'industry'; // simple targeting
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export function listNotifications(): Notification[] {
  return readJson<Notification[]>(STORAGE_KEYS.notifications, []);
}

export function addNotification(n: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
  const entry: Notification = { id: generateId('ntf'), read: false, createdAt: new Date().toISOString(), ...n };
  const all = listNotifications();
  all.unshift(entry);
  writeJson(STORAGE_KEYS.notifications, all);
  return entry;
}

export function markNotificationRead(id: string): void {
  const all = listNotifications();
  const idx = all.findIndex(n => n.id === id);
  if (idx >= 0) { all[idx] = { ...all[idx], read: true }; writeJson(STORAGE_KEYS.notifications, all); }
}

// ---------- Credits helper ----------
export function computeCredits(args: { verifiedHours: number; completedModules: SkillModule[] }): number {
  const hoursCredits = Math.floor(args.verifiedHours / 30); // e.g., 1 credit per 30 verified hours
  const moduleCredits = args.completedModules.reduce((s, m) => s + (m.points || 0), 0);
  return hoursCredits + moduleCredits;
}

// ---------- Mentoring (Faculty) ----------
export type Mentor = {
  id: string;
  name: string;
  type: 'faculty';
  tags: string[];
  bio?: string;
};

export type MentoringSession = {
  id: string;
  studentName: string;
  mentorId: string;
  time: string; // ISO
  status: 'requested' | 'confirmed' | 'completed';
};

export function listMentors(): Mentor[] {
  const seeded = readJson<Mentor[]>(STORAGE_KEYS.mentors, []);
  if (seeded.length) return seeded;
  const defaults: Mentor[] = [
    { id: generateId('m'), name: 'Dr. Johnson (Faculty)', type: 'faculty', tags: ['React', 'Frontend'] },
    { id: generateId('m'), name: 'Dr. Williams (Faculty)', type: 'faculty', tags: ['Node', 'APIs'] },
    { id: generateId('m'), name: 'Dr. Kumar (Faculty)', type: 'faculty', tags: ['DSA', 'Systems'] },
  ];
  writeJson(STORAGE_KEYS.mentors, defaults);
  return defaults;
}

export function listMentoringSessions(studentName?: string): MentoringSession[] {
  const all = readJson<MentoringSession[]>(STORAGE_KEYS.mentoringSessions, []);
  return studentName ? all.filter(s => s.studentName === studentName) : all;
}

export function requestMentoringSession(data: { studentName: string; mentorId: string; time: string }): MentoringSession {
  const session: MentoringSession = { id: generateId('sess'), status: 'requested', ...data };
  const all = readJson<MentoringSession[]>(STORAGE_KEYS.mentoringSessions, []);
  all.unshift(session);
  writeJson(STORAGE_KEYS.mentoringSessions, all);
  return session;
}

// ---------- Student Profiles ----------
export type StudentProfile = {
  id: string;
  userName: string;
  department: string;
  year: number;
  semester: number;
  skills: string[];
  interests: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }>;
  academicDetails: {
    cgpa?: number;
    percentage?: number;
    major?: string;
  };
};

export function getStudentProfile(userName: string): StudentProfile | null {
  const all = readJson<StudentProfile[]>(STORAGE_KEYS.studentProfiles, []);
  return all.find(p => p.userName === userName) || null;
}

export function upsertStudentProfile(profile: StudentProfile): void {
  const all = readJson<StudentProfile[]>(STORAGE_KEYS.studentProfiles, []);
  const idx = all.findIndex(p => p.userName === profile.userName);
  if (idx >= 0) all[idx] = profile; else all.push(profile);
  writeJson(STORAGE_KEYS.studentProfiles, all);
}

// ---------- Badges ----------
export type Badge = {
  id: string;
  userName: string;
  moduleId: string;
  moduleName: string;
  earnedAt: string;
  type: 'completion' | 'excellence' | 'early-bird';
};

export function listBadges(userName?: string): Badge[] {
  const all = readJson<Badge[]>(STORAGE_KEYS.badges, []);
  return userName ? all.filter(b => b.userName === userName) : all;
}

export function awardBadge(data: Omit<Badge, 'id' | 'earnedAt'>): Badge {
  const badge: Badge = { ...data, id: generateId('badge'), earnedAt: new Date().toISOString() };
  const all = readJson<Badge[]>(STORAGE_KEYS.badges, []);
  all.push(badge);
  writeJson(STORAGE_KEYS.badges, all);
  return badge;
}

// ---------- Events/Webinars ----------
export type Event = {
  id: string;
  title: string;
  type: 'webinar' | 'hackathon' | 'workshop' | 'career-fair';
  description: string;
  date: string;
  organizer: string;
  registrationLink?: string;
  tags: string[];
  postedAt: string;
};

export function listEvents(): Event[] {
  const seeded = readJson<Event[]>(STORAGE_KEYS.events, []);
  if (seeded.length) return seeded;
  const defaults: Event[] = [
    {
      id: generateId('evt'),
      title: 'AI in Industry - Webinar Series',
      type: 'webinar',
      description: 'Learn how AI is transforming industries',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      organizer: 'Admin',
      tags: ['AI', 'Technology'],
      postedAt: new Date().toISOString(),
    },
  ];
  writeJson(STORAGE_KEYS.events, defaults);
  return defaults;
}

export function createEvent(event: Omit<Event, 'id' | 'postedAt'>): Event {
  const newEvent: Event = { ...event, id: generateId('evt'), postedAt: new Date().toISOString() };
  const all = readJson<Event[]>(STORAGE_KEYS.events, []);
  all.unshift(newEvent);
  writeJson(STORAGE_KEYS.events, all);
  return newEvent;
}

// ---------- Industry Feedback ----------
export type IndustryFeedback = {
  id: string;
  companyName: string;
  skillGaps: string[];
  recommendations: string;
  semester: string;
  submittedAt: string;
};

export function listIndustryFeedback(): IndustryFeedback[] {
  return readJson<IndustryFeedback[]>(STORAGE_KEYS.industryFeedback, []);
}

export function submitIndustryFeedback(feedback: Omit<IndustryFeedback, 'id' | 'submittedAt'>): IndustryFeedback {
  const newFeedback: IndustryFeedback = { ...feedback, id: generateId('fb'), submittedAt: new Date().toISOString() };
  const all = readJson<IndustryFeedback[]>(STORAGE_KEYS.industryFeedback, []);
  all.unshift(newFeedback);
  writeJson(STORAGE_KEYS.industryFeedback, all);
  return newFeedback;
}

// ---------- Readiness Score Calculation ----------
export function calculateReadinessScore(args: {
  completedModules: number;
  totalModules: number;
  cgpa?: number;
  projectCount: number;
  certificationCount: number;
  internshipCount: number;
}): number {
  const moduleScore = (args.completedModules / Math.max(args.totalModules, 1)) * 30;
  const academicScore = args.cgpa ? (args.cgpa / 10) * 20 : 15;
  const projectScore = Math.min(args.projectCount * 5, 20);
  const certScore = Math.min(args.certificationCount * 5, 15);
  const internshipScore = Math.min(args.internshipCount * 15, 15);
  return Math.round(moduleScore + academicScore + projectScore + certScore + internshipScore);
}

// ---------- NEP Credit Transfer Eligibility ----------
export type DepartmentRegulation = {
  department: string;
  minHours: number; // Minimum internship hours
  minModules: number; // Minimum pre-internship modules
  minCGPA?: number; // Minimum CGPA requirement
  creditsAwarded: number; // Credits to be transferred
  acceptedCourseTypes: string[]; // Types of courses that qualify
};

export const DEPARTMENT_REGULATIONS: DepartmentRegulation[] = [
  {
    department: "Computer Science",
    minHours: 160,
    minModules: 2,
    minCGPA: 6.0,
    creditsAwarded: 4,
    acceptedCourseTypes: ["Technical Skills", "Industry Internship", "Project Work"],
  },
  {
    department: "Electronics",
    minHours: 160,
    minModules: 2,
    minCGPA: 6.0,
    creditsAwarded: 4,
    acceptedCourseTypes: ["Technical Skills", "Industry Internship", "Lab Work"],
  },
  {
    department: "Mechanical",
    minHours: 200,
    minModules: 2,
    minCGPA: 6.0,
    creditsAwarded: 4,
    acceptedCourseTypes: ["Industry Internship", "Design Project", "Technical Training"],
  },
  {
    department: "Civil",
    minHours: 200,
    minModules: 2,
    minCGPA: 6.0,
    creditsAwarded: 4,
    acceptedCourseTypes: ["Field Work", "Industry Internship", "Site Training"],
  },
];

export type CreditTransferEligibility = {
  eligible: boolean;
  reason: string;
  creditsEarned: number;
  hoursCompleted: number;
  hoursRequired: number;
  modulesCompleted: number;
  modulesRequired: number;
  cgpa?: number;
  cgpaRequired?: number;
  department: string;
};

export function checkCreditTransferEligibility(args: {
  department: string;
  verifiedHours: number;
  completedModulesCount: number;
  cgpa?: number;
}): CreditTransferEligibility {
  const regulation = DEPARTMENT_REGULATIONS.find(r => r.department === args.department) || DEPARTMENT_REGULATIONS[0];
  
  const hoursEligible = args.verifiedHours >= regulation.minHours;
  const modulesEligible = args.completedModulesCount >= regulation.minModules;
  const cgpaEligible = !regulation.minCGPA || (args.cgpa && args.cgpa >= regulation.minCGPA);
  
  const eligible = hoursEligible && modulesEligible && cgpaEligible;
  
  let reason = "";
  if (!hoursEligible) {
    reason = `Need ${regulation.minHours - args.verifiedHours} more verified hours`;
  } else if (!modulesEligible) {
    reason = `Need ${regulation.minModules - args.completedModulesCount} more pre-internship modules`;
  } else if (!cgpaEligible) {
    reason = `CGPA must be at least ${regulation.minCGPA}`;
  } else {
    reason = "All requirements met - eligible for credit transfer";
  }
  
  return {
    eligible,
    reason,
    creditsEarned: eligible ? regulation.creditsAwarded : 0,
    hoursCompleted: args.verifiedHours,
    hoursRequired: regulation.minHours,
    modulesCompleted: args.completedModulesCount,
    modulesRequired: regulation.minModules,
    cgpa: args.cgpa,
    cgpaRequired: regulation.minCGPA,
    department: regulation.department,
  };
}
