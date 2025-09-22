import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitBranch, User, LogOut, MessageCircle } from "lucide-react";

export function Navigation() {
  // Mock user state - replace with actual auth state
  const isLoggedIn = false;

  return (
    <nav className="glass-card border-glass-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GitBranch className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              BitBranch
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/support" 
              className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Support</span>
            </Link>
            {isLoggedIn && (
              <Link 
                to="/dashboard" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="outline" size="sm" className="glass-button">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-primary">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
