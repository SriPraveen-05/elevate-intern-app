import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            Prashiskshan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/student" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Student Portal
          </Link>
          <Link to="/industry" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Industry Portal
          </Link>
          <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Admin Portal
          </Link>
          <Button variant="default" size="sm">
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/student" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Student Portal
            </Link>
            <Link to="/industry" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Industry Portal
            </Link>
            <Link to="/admin" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Admin Portal
            </Link>
            <Button variant="default" size="sm">
              Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
