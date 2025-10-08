import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, roles }: { children: ReactNode; roles: Array<"student" | "faculty" | "admin" | "industry" | "alumni">; }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
