import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const roleRoutes: Record<string, string> = {
  student: "/student",
  faculty: "/faculty",
  admin: "/admin",
  industry: "/industry",
  alumni: "/alumni",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "faculty" | "admin" | "industry" | "alumni">("student");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = { id: `local_${Date.now()}`, name: name || "User", role };
    login(user);
    navigate(roleRoutes[role]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select id="role" className="w-full border rounded-md h-10 px-3 bg-background" value={role} onChange={(e) => setRole(e.target.value as any)}>
                  <option value="student">Student</option>
                  <option value="faculty">Mentor</option>
                  <option value="admin">Admin</option>
                  <option value="industry">Industry</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Continue</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
