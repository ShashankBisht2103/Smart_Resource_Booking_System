import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Bell, User, Menu, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { userRole, signOut, isAuthenticated } = useAuth();
  const isHome = location.pathname === "/";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur transition-all duration-300",
        isScrolled ? "py-2 shadow-md" : "py-4"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">SmartBook</span>
        </Link>

        {!isHome && isAuthenticated && (
          <div className="hidden md:flex items-center gap-6">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/admin/dashboard" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Shield className="h-4 w-4 inline mr-1" />
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/requests"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/admin/requests" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Requests
                </Link>
                <Link
                  to="/admin/bookings"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/admin/bookings" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  All Bookings
                </Link>
                <Link
                  to="/admin/notifications"
                  className="relative text-muted-foreground hover:text-primary transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                    3
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  to="/book"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/book" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Book Resource
                </Link>
                <Link
                  to="/bookings"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === "/bookings" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  My Bookings
                </Link>
                <Link
                  to="/notifications"
                  className="relative text-muted-foreground hover:text-primary transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                    3
                  </span>
                </Link>
              </>
            )}
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}

        {isHome && (
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="default" className="font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        )}

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
