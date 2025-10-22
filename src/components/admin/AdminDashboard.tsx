import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  BarChart2, 
  Settings, 
  Bell, 
  UserPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  MessageSquare,
  Shield,
  Lock,
  Server,
  Activity,
  CreditCard,
  HelpCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock data - in a real app, this would come from API
const mockUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'student',
    status: 'active',
    lastActive: '2 hours ago',
    avatar: '',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    email: 'taylor@example.com',
    role: 'mentor',
    status: 'active',
    lastActive: '1 day ago',
    avatar: '',
  },
  {
    id: '3',
    name: 'TechCorp Inc.',
    email: 'hr@techcorp.com',
    role: 'industry',
    status: 'pending',
    lastActive: '3 days ago',
    avatar: '',
  },
  {
    id: '4',
    name: 'Jordan Williams',
    email: 'jordan@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '5 minutes ago',
    avatar: '',
  },
];

const mockStats = {
  totalUsers: 1242,
  activeUsers: 987,
  newUsers: 42,
  pendingApprovals: 12,
  activeSessions: 56,
  storageUsed: '2.4',
  storageTotal: '10',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your platform and monitor activity
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.newUsers} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.activeSessions} active sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Requires your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.storageUsed} GB</div>
            <div className="mt-1">
              <Progress value={(parseFloat(mockStats.storageUsed) / parseFloat(mockStats.storageTotal)) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {mockStats.storageTotal} GB total storage
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage all users and their permissions
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8 sm:w-[200px] md:w-[300px]"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2 opacity-50" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="industry">Industry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'outline' : 'secondary'}>
                            {user.status === 'active' ? 'Active' : 'Pending'}
                          </Badge>
                          <div className="hidden md:flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {user.lastActive}
                          </div>
                          <Button variant="ghost" size="icon">
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Message</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Platform usage and activity metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="h-[300px] bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {i === 1 && 'New user registration: Alex Johnson'}
                          {i === 2 && 'Mentoring session completed'}
                          {i === 3 && 'New internship posted by TechCorp'}
                          {i === 4 && 'System update completed'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i} hour{i !== 1 ? 's' : ''} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'Students', value: 65, color: 'bg-blue-500' },
                    { name: 'Mentors', value: 20, color: 'bg-green-500' },
                    { name: 'Industry', value: 10, color: 'bg-purple-500' },
                    { name: 'Admins', value: 5, color: 'bg-amber-500' },
                  ].map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className={`h-2 [&>div]:${item.color}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">API Status</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Database</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Storage</span>
                  </div>
                  <span className="text-sm text-muted-foreground">24% used</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Uptime</span>
                  </div>
                  <span className="text-sm text-muted-foreground">99.9%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure platform-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="InternConnect" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="UTC">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (EST/EDT)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST/PDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Require users to enable 2FA for added security
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        Set requirements for user passwords
                      </p>
                    </div>
                    <Button variant="outline">Edit</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Maintenance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Backup Database</h4>
                      <p className="text-sm text-muted-foreground">
                        Last backup: 2 hours ago
                      </p>
                    </div>
                    <Button variant="outline">Backup Now</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">System Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Version 2.1.0 (Up to date)
                      </p>
                    </div>
                    <Button variant="outline">Check for Updates</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
