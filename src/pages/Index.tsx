import Header from "@/components/Header";
import PortalCard from "@/components/PortalCard";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, Shield, CheckCircle, Target, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container px-4 py-20 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Empowering Students Through
                <span className="bg-gradient-hero bg-clip-text text-transparent"> NEP-Compliant </span>
                Internships
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Prashiskshan bridges the gap between education and industry, providing verified internships, 
                skill development, and seamless credit integration for Indian colleges.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-hero">
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative animate-scale-in">
              <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="Students collaborating on internship opportunities" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Internship Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage internships effectively across students, colleges, and industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Portal
            </h2>
            <p className="text-lg text-muted-foreground">
              Access the platform tailored to your role
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PortalCard
              title="Student Portal"
              description="Discover internships, track progress, and build your skills"
              icon={GraduationCap}
              link="/student"
              gradient="primary"
            />
            <PortalCard
              title="Industry Portal"
              description="Post opportunities, review applications, and provide feedback"
              icon={Building2}
              link="/industry"
              gradient="secondary"
            />
            <PortalCard
              title="Admin Portal"
              description="Verify companies, monitor progress, and generate analytics"
              icon={Shield}
              link="/admin"
              gradient="accent"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Prashiskshan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Prashiskshan. NEP-Compliant Internship Management Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: CheckCircle,
    title: "Verified Internships",
    description: "Industry-verified opportunities ensuring quality and authenticity"
  },
  {
    icon: Target,
    title: "Skill Readiness",
    description: "Pre-internship modules to prepare students for success"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Digital logbooks and milestone monitoring in real-time"
  },
  {
    icon: Users,
    title: "Multi-Stakeholder",
    description: "Seamless collaboration between students, industry, and faculty"
  }
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "500+", label: "Partner Companies" },
  { value: "100+", label: "Registered Colleges" },
  { value: "95%", label: "Completion Rate" }
];

export default Index;
