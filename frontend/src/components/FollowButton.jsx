import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { socialService } from "@/services/socialService";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";

export function FollowButton({ userId, initialFollowing = false, className = "" }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  useEffect(() => {
    // Check if already following when component mounts
    if (user && userId && userId !== user.id) {
      checkFollowingStatus();
    }
  }, [user, userId]);

  const checkFollowingStatus = async () => {
    try {
      const response = await socialService.isFollowing(userId);
      setIsFollowing(response.isFollowing || false);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleToggleFollow = async () => {
    if (!user) {
      toast.error("Please login to follow users");
      return;
    }

    if (userId === user.id) {
      toast.error("You cannot follow yourself");
      return;
    }

    try {
      setLoading(true);
      
      if (isFollowing) {
        await socialService.unfollowUser(userId);
        setIsFollowing(false);
        toast.success("User unfollowed");
      } else {
        await socialService.followUser(userId);
        setIsFollowing(true);
        toast.success("User followed");
      }
      
      // Refresh user data to update follower/following counts
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if user is viewing their own profile
  if (!user || userId === user.id) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleToggleFollow}
      disabled={loading}
      className={`flex items-center gap-2 ${className}`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
