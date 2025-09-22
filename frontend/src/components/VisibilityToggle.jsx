import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { repoService } from "@/services/repoService";
import { Eye, EyeOff, Lock, Globe, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export function VisibilityToggle({ repositoryId, initialVisibility = true, onVisibilityChange, showAsDropdown = false }) {
  const [visibility, setVisibility] = useState(initialVisibility);
  const [loading, setLoading] = useState(false);

  const handleToggleVisibility = async () => {
    try {
      setLoading(true);
      const response = await repoService.toggleRepositoryVisibility(repositoryId);
      
      const newVisibility = !visibility;
      setVisibility(newVisibility);
      
      if (onVisibilityChange) {
        onVisibilityChange(newVisibility);
      }
      
      toast.success(`Repository is now ${newVisibility ? 'public' : 'private'}`);
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to update repository visibility");
    } finally {
      setLoading(false);
    }
  };

  if (showAsDropdown) {
    return (
      <DropdownMenuItem onClick={handleToggleVisibility} disabled={loading}>
        {visibility ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Make Private
          </>
        ) : (
          <>
            <Globe className="h-4 w-4 mr-2" />
            Make Public
          </>
        )}
      </DropdownMenuItem>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={visibility ? "default" : "secondary"} className="flex items-center gap-1">
        {visibility ? (
          <>
            <Globe className="h-3 w-3" />
            Public
          </>
        ) : (
          <>
            <Lock className="h-3 w-3" />
            Private
          </>
        )}
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleVisibility}
        disabled={loading}
        className="h-8 px-2"
      >
        {visibility ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export function VisibilityBadge({ isPublic }) {
  return (
    <Badge variant={isPublic ? "default" : "secondary"} className="flex items-center gap-1">
      {isPublic ? (
        <>
          <Globe className="h-3 w-3" />
          Public
        </>
      ) : (
        <>
          <Lock className="h-3 w-3" />
          Private
        </>
      )}
    </Badge>
  );
}
