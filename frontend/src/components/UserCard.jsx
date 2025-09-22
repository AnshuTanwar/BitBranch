import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/FollowButton";
import { MapPin, Users, GitFork } from "lucide-react";

export function UserCard({ user, viewMode = 'grid', onFollow, className }) {
  const handleFollow = () => {
    if (onFollow) {
      onFollow(user._id);
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className={`glass-card border-glass-border/50 hover:border-glass-border transition-colors ${className || ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="text-sm">
                {user.username?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link 
                    to={`/users/${user._id}`}
                    className="text-lg font-semibold hover:text-primary transition-colors"
                  >
                    {user.username}
                  </Link>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <FollowButton 
                  userId={user._id}
                  initialFollowing={user.isFollowing}
                  className="ml-2 glass-button border-glass-border/30"
                />
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  <span className="font-medium text-foreground">{user.followers?.length || 0}</span>
                  <span className="ml-1">followers</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{user.following?.length || 0}</span>
                  <span className="ml-1">following</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <GitFork className="h-3 w-3 mr-1" />
                  <span className="font-medium text-foreground">{user.repositories?.length || 0}</span>
                  <span className="ml-1">repos</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className={`glass-card border-glass-border/50 hover:border-glass-border transition-colors ${className || ''}`}>
      <CardContent className="p-6 text-center">
        <Avatar className="h-16 w-16 mx-auto mb-4">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="text-lg">
            {user.username?.slice(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="mb-4">
          <Link 
            to={`/users/${user._id}`}
            className="text-lg font-semibold hover:text-primary transition-colors block"
          >
            {user.username}
          </Link>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        
        {user.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {user.bio}
          </p>
        )}
        
        {user.location && (
          <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-3 w-3 mr-1" />
            {user.location}
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
          <div className="text-center">
            <div className="font-medium">{user.followers?.length || 0}</div>
            <div className="text-xs text-muted-foreground">followers</div>
          </div>
          
          <div className="text-center">
            <div className="font-medium">{user.following?.length || 0}</div>
            <div className="text-xs text-muted-foreground">following</div>
          </div>
          
          <div className="text-center">
            <div className="font-medium">{user.repositories?.length || 0}</div>
            <div className="text-xs text-muted-foreground">repos</div>
          </div>
        </div>
        
        <FollowButton 
          userId={user._id}
          initialFollowing={user.isFollowing}
          className="w-full glass-button border-glass-border/30"
        />
      </CardContent>
    </Card>
  );
}
