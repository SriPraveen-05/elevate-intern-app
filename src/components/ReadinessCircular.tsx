import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ReadinessCircular = () => {
  const readinessScore = 62;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Internship Readiness</CardTitle>
        <CardDescription>Based on skill modules, projects, and academics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-6">
          {/* Circular Progress */}
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="hsl(var(--muted))"
                strokeWidth="20"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="hsl(var(--primary))"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - readinessScore / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">{readinessScore}%</div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-semibold mb-2">Ready to apply</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>Skill modules: 12/15 completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>Projects: 3 submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>Academic score: 8.2/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress breakdown */}
        <div className="space-y-3 mt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Technical Skills</span>
              <span className="text-muted-foreground">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Soft Skills</span>
              <span className="text-muted-foreground">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Domain Knowledge</span>
              <span className="text-muted-foreground">55%</span>
            </div>
            <Progress value={55} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadinessCircular;
