import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitBranch, Users, FolderGit2, User, LogOut, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AuthHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <GitBranch className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              BitBranch
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/repositories" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <FolderGit2 className="h-5 w-5" />
              <span>Repositories</span>
            </Link>
            <Link 
              to="/users" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link 
              to="/issues" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Issues</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
