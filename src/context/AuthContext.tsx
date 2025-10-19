import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Role = "student" | "faculty" | "admin" | "industry";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  register: (userData: RegisterData) => Promise<AuthUser>;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: Role;
  department?: string;
  company?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "app.auth.user";
const JWT_SECRET = "your-jwt-secret-key"; // In production, use environment variable

// Simple JWT implementation for demo purposes
function createJWT(payload: any, secret: string = JWT_SECRET): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(secret + encodedPayload); // Simplified signature
  return `${header}.${encodedPayload}.${signature}`;
}

function verifyJWT(token: string, secret: string = JWT_SECRET): any | null {
  try {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check expiration
    if (decodedPayload.exp && Date.now() > decodedPayload.exp * 1000) {
      return null;
    }
    
    return decodedPayload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const userData = JSON.parse(raw);
        // Verify token if it exists
        if (userData.token) {
          const payload = verifyJWT(userData.token);
          if (payload) {
            setUser(userData);
          } else {
            // Token expired, try to refresh
            refreshToken().then(success => {
              if (!success) {
                localStorage.removeItem(STORAGE_KEY);
              }
            });
          }
        } else {
          setUser(userData);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const register = async (userData: RegisterData): Promise<AuthUser> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      token: createJWT({
        sub: `user_${Date.now()}`,
        name: userData.name,
        role: userData.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }),
      refreshToken: createJWT({
        sub: `user_${Date.now()}`,
        type: "refresh",
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const login = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      
      const userData = JSON.parse(raw);
      if (!userData.refreshToken) return false;
      
      const payload = verifyJWT(userData.refreshToken);
      if (!payload) return false;
      
      // Generate new token
      const newToken = createJWT({
        sub: payload.sub,
        name: userData.name,
        role: userData.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      });
      
      const updatedUser = {
        ...userData,
        token: newToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };
      
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return true;
    } catch {
      return false;
    }
  };

  const isAuthenticated = !!user && (!user.token || verifyJWT(user.token));

  const value = useMemo(() => ({ 
    user, 
    login, 
    logout, 
    register, 
    refreshToken, 
    isAuthenticated 
  }), [user]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
