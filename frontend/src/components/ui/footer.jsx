import { Link } from "react-router-dom";
import { GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-green-200/50 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <GitBranch className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              BitBranch
            </span>
          </div>

          {/* Essential Links */}
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-green-700 hover:text-green-600 transition-colors text-sm">
              Sign In
            </Link>
            <Link to="/signup" className="text-green-700 hover:text-green-600 transition-colors text-sm">
              Sign Up
            </Link>
            <a href="#" className="text-green-700 hover:text-green-600 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-green-700 hover:text-green-600 transition-colors text-sm">
              Terms of Service
            </a>
          </div>

          {/* Copyright */}
          <p className="text-green-600 text-sm">
            © 2024 BitBranch
          </p>
        </div>
      </div>
    </footer>
  );
}
