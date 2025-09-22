import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarButton } from "@/components/StarButton";
import { VisibilityBadge, VisibilityToggle } from "@/components/VisibilityToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Star, GitFork, Clock, Lock, Globe } from "lucide-react";

export function RepoCard({ repository, onStar, isStarred, className, showOwnerActions = false }) {
  const { user } = useAuth();
  
  const handleStar = () => {
    if (onStar) {
      onStar(repository._id);
    }
  };

  const isOwner = user && repository.owner && (user.id === repository.owner._id || user.id === repository.owner);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className={`glass-card border-glass-border/50 hover:border-glass-border transition-colors ${className || ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">
              <Link 
                to={`/repos/${repository._id}`}
                className="hover:text-primary transition-colors flex items-center"
              >
                {!repository.visibility ? (
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                ) : (
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                <span className="font-bold">{repository.name}</span>
              </Link>
            </CardTitle>
            
            {repository.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {repository.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showOwnerActions && isOwner && (
              <VisibilityToggle 
                repositoryId={repository._id}
                initialVisibility={repository.visibility}
              />
            )}
            
            <StarButton 
              repositoryId={repository._id}
              initialStarred={isStarred}
              initialStarCount={repository.stars || 0}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {repository.language && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2" />
                {repository.language}
              </div>
            )}
            
            <div className="flex items-center">
              <Star className="h-3 w-3 mr-1" />
              {repository.stars || 0}
            </div>
            
            <div className="flex items-center">
              <GitFork className="h-3 w-3 mr-1" />
              {repository.forks || 0}
            </div>
            
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(repository.updatedAt)}
            </div>
          </div>
          
          <VisibilityBadge isPublic={repository.visibility} />
        </div>
      </CardContent>
    </Card>
  );
}
