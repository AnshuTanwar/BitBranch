import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { issueService } from "@/services/issueService";
import { CircleDot, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { 
    value: "open", 
    label: "Open", 
    icon: CircleDot, 
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-100"
  },
  { 
    value: "in-progress", 
    label: "In Progress", 
    icon: Clock, 
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100"
  },
  { 
    value: "closed", 
    label: "Closed", 
    icon: CheckCircle2, 
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100"
  },
];

export function IssueStatus({ issueId, currentStatus = "open", onStatusChange, readOnly = false, showQuickActions = true }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = async (newStatus) => {
    if (readOnly) return;
    
    try {
      setLoading(true);
      await issueService.updateIssueStatus(issueId, { status: newStatus });
      
      setStatus(newStatus);
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      
      toast.success(`Issue ${newStatus === "closed" ? "closed" : "updated"}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickClose = async () => {
    try {
      setLoading(true);
      await issueService.closeIssue(issueId);
      
      setStatus("closed");
      
      if (onStatusChange) {
        onStatusChange("closed");
      }
      
      toast.success("Issue closed");
    } catch (error) {
      console.error("Error closing issue:", error);
      toast.error("Failed to close issue");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReopen = async () => {
    try {
      setLoading(true);
      await issueService.reopenIssue(issueId);
      
      setStatus("open");
      
      if (onStatusChange) {
        onStatusChange("open");
      }
      
      toast.success("Issue reopened");
    } catch (error) {
      console.error("Error reopening issue:", error);
      toast.error("Failed to reopen issue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (statusValue) => {
    return STATUS_OPTIONS.find(option => option.value === statusValue) || STATUS_OPTIONS[0];
  };

  const statusConfig = getStatusConfig(status);
  const Icon = statusConfig.icon;

  if (readOnly) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Status:</span>
        <Badge 
          variant="secondary" 
          className={`flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.textColor} border-0`}
        >
          <Icon className="h-3 w-3" />
          {statusConfig.label}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Status:</span>
        <Select 
          value={status} 
          onValueChange={handleStatusChange}
          disabled={loading}
        >
          <SelectTrigger className="w-40">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {statusConfig.label}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => {
              const OptionIcon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <OptionIcon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Quick action buttons */}
      {showQuickActions && (
        <div className="flex gap-2">
          {status !== "closed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickClose}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Close Issue
            </Button>
          )}
          
          {status === "closed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickReopen}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CircleDot className="h-4 w-4" />
              Reopen Issue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status = "open", className = "" }) {
  const statusConfig = getStatusConfig(status);
  const Icon = statusConfig.icon;

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.textColor} border-0 ${className}`}
    >
      <Icon className="h-3 w-3" />
      {statusConfig.label}
    </Badge>
  );
}

function getStatusConfig(statusValue) {
  return STATUS_OPTIONS.find(option => option.value === statusValue) || STATUS_OPTIONS[0];
}
