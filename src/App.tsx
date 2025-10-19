import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentPortal from "./pages/StudentPortal";
import IndustryPortal from "./pages/IndustryPortal";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";
import InternshipDetails from "./pages/InternshipDetails";
import Login from "./pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import DataSync from "@/components/DataSync";
import FacultyPanel from "./pages/FacultyPanel";
import StudentAIHub from "./pages/StudentAIHub";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import StudentProfile from "./pages/StudentProfile";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <DataSync />
            <PWAInstallPrompt />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route
              path="/faculty"
              element={
                <ProtectedRoute roles={["faculty", "admin"]}>
                  <FacultyPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentAIHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/industry"
              element={
                <ProtectedRoute roles={["industry"]}>
                  <IndustryPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin", "faculty"]}>
                  <AdminPortal />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
