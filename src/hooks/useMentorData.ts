import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';

export interface Mentee {
  id: string;
  name: string;
  avatar?: string;
  program: string;
  progress: number;
  lastActive: string;
  nextSession: string | null;
  skills: string[];
  status: 'active' | 'needsAttention' | 'inactive';
  university: string;
  joinedDate: string;
  sessionsCompleted: number;
  rating: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'guide' | 'video' | 'template' | 'worksheet' | 'checklist';
  category: string;
  url: string;
  added: string;
  description?: string;
  duration?: string;
  icon?: React.ReactNode;
}

export interface Session {
  id: string;
  title: string;
  mentee: {
    id: string;
    name: string;
    avatar?: string;
  };
  date: Date;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
}

interface MentorData {
  stats: {
    totalMentees: number;
    activeMentees: number;
    sessionsThisMonth: number;
    averageRating: number;
    upcomingSessions: number;
    pendingTasks: number;
    goalAchievement: number;
  };
  mentees: Mentee[];
  sessions: Session[];
  resources: Resource[];
  quickTips: string[];
}

const generateMockMentees = (): Mentee[] => [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    program: 'Software Engineering',
    progress: 75,
    lastActive: '2 hours ago',
    nextSession: 'Tomorrow, 2:00 PM',
    skills: ['React', 'Node.js', 'TypeScript'],
    status: 'active',
    university: 'Stanford University',
    joinedDate: '2023-01-15',
    sessionsCompleted: 12,
    rating: 4.9
  },
  // Add more mock mentees as needed
];

const generateMockSessions = (): Session[] => {
  const now = new Date();
  return [
    {
      id: 's1',
      title: 'React Best Practices',
      mentee: {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      date: addDays(now, 1),
      duration: 60,
      status: 'upcoming',
      meetingLink: 'https://meet.example.com/abc123'
    },
    // Add more mock sessions as needed
  ];
};

const generateMockResources = (): Resource[] => [
  {
    id: 'r1',
    title: 'Mentor Guide',
    type: 'guide',
    category: 'Onboarding',
    url: '#',
    added: '2023-10-15',
    description: 'Complete guide for new mentors',
  }
  // Add more mock resources as needed
];

// Export the hook with proper types
export function useMentorData(): { data: MentorData | null; isLoading: boolean; error: Error | null } {
  const [data, setData] = useState<MentorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData: MentorData = {
          stats: {
            totalMentees: 12,
            activeMentees: 8,
            sessionsThisMonth: 24,
            averageRating: 4.8,
            upcomingSessions: 3,
            pendingTasks: 2,
            goalAchievement: 85
          },
          mentees: generateMockMentees(),
          sessions: generateMockSessions(),
          resources: generateMockResources(),
          quickTips: [
            'Schedule regular check-ins with your mentees',
            'Provide constructive feedback after each session',
            'Share relevant resources and learning materials'
          ]
        };
        
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
