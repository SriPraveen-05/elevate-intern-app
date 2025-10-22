// Base user profile interface
export interface BaseProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  metadata?: Record<string, any>;
}

export interface StudentProfile extends BaseProfile {
  skills: string[];
  skillLevels?: Array<{
    name: string;
    level: number;
  }>;
  internshipCredits: number;
  certificationCredits: number;
  courseCredits: number;
  workshopCredits: number;
  preferredCompanies: string[];
  preferredLocations: string[];
  preferredJobTypes?: string[];
  preferredRoles?: string[];
  bio?: string;
  phone?: string;
  address?: string;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrent?: boolean;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate?: string;
    url?: string;
  }>;
  socialLinks?: Record<string, string>;
  settings?: Record<string, any>;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
    action?: {
      label: string;
      url: string;
    };
  }>;
}

export interface MentorProfile extends BaseProfile {
  bio?: string;
  expertise: string[];
  yearsOfExperience: number;
  currentPosition: string;
  company: string;
  availability: Array<{
    day: string;
    slots: Array<{
      start: string;
      end: string;
    }>;
  }>;
  mentees: string[];
  rating?: number;
  totalSessions: number;
}

export interface IndustryProfile extends BaseProfile {
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
}

export interface AdminProfile extends BaseProfile {
  permissions: string[];
  lastActivity: string;
  managedUsers: number;
  managedCompanies: number;
}

export type UserProfile = StudentProfile | MentorProfile | IndustryProfile | AdminProfile;

// Other common types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  earned: boolean;
  earnedAt?: string;
  credits?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'workshop' | 'seminar' | 'networking' | 'other';
  attendees: string[];
  maxAttendees: number;
  organizer: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  action?: {
    label: string;
    url: string;
  };
}
