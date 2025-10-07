import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const InternshipAnalytics = () => {
  const data = [
    { month: "Jan", applications: 12, accepted: 8, completed: 4 },
    { month: "Feb", applications: 18, accepted: 10, completed: 7 },
    { month: "Mar", applications: 22, accepted: 14, completed: 8 },
    { month: "Apr", applications: 27, accepted: 18, completed: 7 },
    { month: "May", applications: 24, accepted: 16, completed: 12 },
    { month: "Jun", applications: 19, accepted: 13, completed: 9 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Internship Analytics</CardTitle>
        <CardDescription>Trends to guide curriculum & outreach</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="applications" fill="hsl(var(--primary))" name="Applications" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accepted" fill="hsl(var(--accent))" name="Accepted" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="hsl(var(--secondary))" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">122</div>
            <div className="text-xs text-muted-foreground">Total Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">79</div>
            <div className="text-xs text-muted-foreground">Accepted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">47</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternshipAnalytics;
