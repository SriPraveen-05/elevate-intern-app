import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, Bell, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMarkNotificationRead, useNotifications } from "@/hooks/useData";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const visibleNotifications = notifications.filter(n => !n.userRole || n.userRole === user?.role);
  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            VIPBuddy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/faculty" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Mentor
          </Link>
          <Link to="/alumni" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Alumni
          </Link>
          {user?.role === "student" && (
            <Link to="/profile" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              <User className="h-4 w-4 inline mr-1" />
              Profile
            </Link>
          )}
          <Link to="/student" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Student Portal
          </Link>
          <Link to="/industry" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Industry Portal
          </Link>
          <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Admin Portal
          </Link>
          {/* Notifications */}
          <div className="relative">
            <button className="relative" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-md shadow-lg p-2 space-y-2">
                <div className="text-sm font-semibold px-2">Notifications</div>
                {visibleNotifications.length === 0 ? (
                  <div className="text-xs text-muted-foreground px-2 py-1">No notifications</div>
                ) : (
                  visibleNotifications.slice(0, 8).map(n => (
                    <div key={n.id} className="flex justify-between items-start gap-2 p-2 rounded hover:bg-muted/40">
                      <div>
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.body}</div>
                      </div>
                      {!n.read && (
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => markRead.mutate(n.id)}>Mark read</Button>
                      )}
                    </div>
                  ))
                )}
                <div className="text-[10px] text-muted-foreground px-2">Showing latest {Math.min(8, visibleNotifications.length)}</div>
              </div>
            )}
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded bg-muted capitalize">{user.role}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">Login</Button>
            </Link>
          )}
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
            {user ? (
              <Button variant="outline" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
