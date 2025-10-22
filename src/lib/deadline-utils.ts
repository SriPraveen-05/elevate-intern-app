import { generateId } from "./storage";
import { getStudentProfile, upsertStudentProfile, type StudentProfile } from "./storage";

export interface Deadline {
  id: string;
  title: string;
  dueDate: string; // ISO date string
  description?: string;
  type: 'assignment' | 'exam' | 'project' | 'other';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const addDeadline = (userName: string, deadline: Omit<Deadline, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): Deadline => {
  const profile = getStudentProfile(userName);
  if (!profile) {
    throw new Error(`Student profile not found for user: ${userName}`);
  }

  const newDeadline: Deadline = {
    ...deadline,
    id: generateId('dl'),
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedProfile: StudentProfile = {
    ...profile,
    upcomingDeadlines: [...(profile.upcomingDeadlines || []), newDeadline]
  };

  upsertStudentProfile(updatedProfile);
  return newDeadline;
};

export const updateDeadline = (userName: string, deadlineId: string, updates: Partial<Omit<Deadline, 'id' | 'createdAt'>>): Deadline | null => {
  const profile = getStudentProfile(userName);
  if (!profile) {
    throw new Error(`Student profile not found for user: ${userName}`);
  }

  const deadlineIndex = (profile.upcomingDeadlines || []).findIndex(d => d.id === deadlineId);
  if (deadlineIndex === -1) return null;

  const updatedDeadline: Deadline = {
    ...profile.upcomingDeadlines[deadlineIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedDeadlines = [...(profile.upcomingDeadlines || [])];
  updatedDeadlines[deadlineIndex] = updatedDeadline;

  const updatedProfile: StudentProfile = {
    ...profile,
    upcomingDeadlines: updatedDeadlines
  };

  upsertStudentProfile(updatedProfile);
  return updatedDeadline;
};

export const deleteDeadline = (userName: string, deadlineId: string): boolean => {
  const profile = getStudentProfile(userName);
  if (!profile) {
    throw new Error(`Student profile not found for user: ${userName}`);
  }

  const initialLength = (profile.upcomingDeadlines || []).length;
  const updatedDeadlines = (profile.upcomingDeadlines || []).filter(d => d.id !== deadlineId);
  
  if (updatedDeadlines.length === initialLength) return false;

  const updatedProfile: StudentProfile = {
    ...profile,
    upcomingDeadlines: updatedDeadlines
  };

  upsertStudentProfile(updatedProfile);
  return true;
};

export const getUpcomingDeadlines = (userName: string, options: { 
  includeCompleted?: boolean;
  limit?: number;
  type?: Deadline['type'];
} = {}): Deadline[] => {
  const profile = getStudentProfile(userName);
  if (!profile) return [];

  let deadlines = [...(profile.upcomingDeadlines || [])];
  
  if (options.includeCompleted === false) {
    deadlines = deadlines.filter(d => !d.completed);
  }
  
  if (options.type) {
    deadlines = deadlines.filter(d => d.type === options.type);
  }
  
  // Sort by due date (earliest first)
  deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  return options.limit ? deadlines.slice(0, options.limit) : deadlines;
};
