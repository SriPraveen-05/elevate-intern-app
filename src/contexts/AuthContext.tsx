import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'mentor' | 'mentee' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on initial load
    const checkAuth = async () => {
      try {
        // Simulate API call to check auth status
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app, you would verify the token here
        const storedUser = localStorage.getItem('mentorDashboardUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in a real app, this would come from your API
    const mockUser: User = {
      id: '1',
      name: 'Mentor User',
      email: email,
      role: 'mentor',
      avatar: ''
    };
    
    setUser(mockUser);
    localStorage.setItem('mentorDashboardUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mentorDashboardUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
