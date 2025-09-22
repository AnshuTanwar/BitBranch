import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { issueService } from "@/services/issueService";
import { userService } from "@/services/userService";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";

export function IssueAssignment({ issueId, currentAssignee, onAssigneeChange }) {
  const [assignee, setAssignee] = useState(currentAssignee);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAssignee(currentAssignee);
  }, [currentAssignee]);

  useEffect(() => {
    if (open && users.length === 0) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleAssignUser = async (userId) => {
    try {
      setLoading(true);
      const selectedUser = users.find(user => user._id === userId);
      
      await issueService.assignIssue(issueId, { assigneeId: userId });
      
      setAssignee(selectedUser);
      setOpen(false);
      
      if (onAssigneeChange) {
        onAssigneeChange(selectedUser);
      }
      
      toast.success(`Issue assigned to ${selectedUser.username}`);
    } catch (error) {
      console.error("Error assigning issue:", error);
      toast.error("Failed to assign issue");
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    try {
      setLoading(true);
      await issueService.assignIssue(issueId, { assigneeId: null });
      
      setAssignee(null);
      
      if (onAssigneeChange) {
        onAssigneeChange(null);
      }
      
      toast.success("Issue unassigned");
    } catch (error) {
      console.error("Error unassigning issue:", error);
      toast.error("Failed to unassign issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Assignee:</span>
      
      {assignee ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-2 pr-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback className="text-xs">
                {assignee.username?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{assignee.username}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleUnassign}
              disabled={loading}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Assign
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Assign to user</h4>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {users.map((user) => (
                  <Button
                    key={user._id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => handleAssignUser(user._id)}
                    disabled={loading}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-medium text-sm">{user.username}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </Button>
                ))}
                
                {users.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No users available
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
