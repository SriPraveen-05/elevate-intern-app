import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface PortalCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  gradient: "primary" | "secondary" | "accent";
}

const gradientClasses = {
  primary: "from-primary to-primary-light",
  secondary: "from-secondary to-secondary-light",
  accent: "from-accent to-accent-light",
};

const PortalCard = ({ title, description, icon: Icon, link, gradient }: PortalCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${gradientClasses[gradient]}`} />
      <CardHeader>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientClasses[gradient]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" variant="outline">
          <Link to={link}>Access Portal</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PortalCard;
