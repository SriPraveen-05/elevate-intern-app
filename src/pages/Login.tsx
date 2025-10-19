import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const roleRoutes: Record<string, string> = {
  student: "/student",
  faculty: "/faculty",
  admin: "/admin",
  industry: "/industry",
};

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<"student" | "faculty" | "admin" | "industry">("student");
  const [registerDepartment, setRegisterDepartment] = useState("");
  const [registerCompany, setRegisterCompany] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({ title: "Missing fields", description: "Please fill in email and password." });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a user based on email
      const user = {
        id: `user_${Date.now()}`,
        name: loginEmail.split('@')[0],
        email: loginEmail,
        role: "student" as const, // Default role for demo
        token: "demo-token",
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };
      
      login(user);
      navigate("/student");
      toast({ title: "Login successful", description: "Welcome back!" });
    } catch (error) {
      toast({ title: "Login failed", description: "Invalid credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      toast({ title: "Missing fields", description: "Please fill in all required fields." });
      return;
    }

    setIsLoading(true);
    try {
      const user = await register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
        department: registerDepartment,
        company: registerCompany
      });
      
      navigate(roleRoutes[registerRole]);
      toast({ title: "Registration successful", description: "Account created successfully!" });
    } catch (error) {
      toast({ title: "Registration failed", description: "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome to Elevate Intern App</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)} 
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Login
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input 
                      id="register-name" 
                      placeholder="Your full name" 
                      value={registerName} 
                      onChange={(e) => setRegisterName(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={registerEmail} 
                      onChange={(e) => setRegisterEmail(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      placeholder="Create a password" 
                      value={registerPassword} 
                      onChange={(e) => setRegisterPassword(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <select 
                      id="register-role" 
                      className="w-full border rounded-md h-10 px-3 bg-background" 
                      value={registerRole} 
                      onChange={(e) => setRegisterRole(e.target.value as any)}
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Mentor</option>
                      <option value="admin">Admin</option>
                      <option value="industry">Industry</option>
                    </select>
                  </div>
                  {registerRole === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="register-department">Department</Label>
                      <Input 
                        id="register-department" 
                        placeholder="Computer Science" 
                        value={registerDepartment} 
                        onChange={(e) => setRegisterDepartment(e.target.value)} 
                      />
                    </div>
                  )}
                  {registerRole === "industry" && (
                    <div className="space-y-2">
                      <Label htmlFor="register-company">Company</Label>
                      <Input 
                        id="register-company" 
                        placeholder="Your company name" 
                        value={registerCompany} 
                        onChange={(e) => setRegisterCompany(e.target.value)} 
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
