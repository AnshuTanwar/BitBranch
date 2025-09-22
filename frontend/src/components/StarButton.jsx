import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { repoService } from "@/services/repoService";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from "lucide-react";
import { toast } from "sonner";

export function StarButton({ repositoryId, initialStarred = false, initialStarCount = 0, className = "" }) {
  const [isStarred, setIsStarred] = useState(initialStarred);
  const [starCount, setStarCount] = useState(initialStarCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsStarred(initialStarred);
    setStarCount(initialStarCount);
  }, [initialStarred, initialStarCount]);

  const handleToggleStar = async () => {
    if (!user) {
      toast.error("Please login to star repositories");
      return;
    }

    try {
      setLoading(true);
      
      if (isStarred) {
        await repoService.unstarRepository(repositoryId);
        setIsStarred(false);
        setStarCount(prev => Math.max(0, prev - 1));
        toast.success("Repository unstarred");
      } else {
        await repoService.starRepository(repositoryId);
        setIsStarred(true);
        setStarCount(prev => prev + 1);
        toast.success("Repository starred");
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      toast.error("Failed to update star status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isStarred ? "default" : "outline"}
      size="sm"
      onClick={handleToggleStar}
      disabled={loading}
      className={`flex items-center gap-2 ${className}`}
    >
      <Star 
        className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} 
      />
      <span>{starCount}</span>
      <span className="hidden sm:inline">
        {isStarred ? "Starred" : "Star"}
      </span>
    </Button>
  );
}
