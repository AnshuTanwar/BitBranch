import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { issueService } from "@/services/issueService";
import { AlertTriangle, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { toast } from "sonner";

const PRIORITY_OPTIONS = [
  { 
    value: "low", 
    label: "Low", 
    icon: ArrowDown, 
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100"
  },
  { 
    value: "medium", 
    label: "Medium", 
    icon: Minus, 
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100"
  },
  { 
    value: "high", 
    label: "High", 
    icon: ArrowUp, 
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-100"
  },
];

export function IssuePriority({ issueId, currentPriority = "medium", onPriorityChange, readOnly = false }) {
  const [priority, setPriority] = useState(currentPriority);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPriority(currentPriority);
  }, [currentPriority]);

  const handlePriorityChange = async (newPriority) => {
    if (readOnly) return;
    
    try {
      setLoading(true);
      await issueService.updateIssue(issueId, { priority: newPriority });
      
      setPriority(newPriority);
      
      if (onPriorityChange) {
        onPriorityChange(newPriority);
      }
      
      toast.success(`Priority updated to ${newPriority}`);
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Failed to update priority");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityConfig = (priorityValue) => {
    return PRIORITY_OPTIONS.find(option => option.value === priorityValue) || PRIORITY_OPTIONS[1];
  };

  const priorityConfig = getPriorityConfig(priority);
  const Icon = priorityConfig.icon;

  if (readOnly) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Priority:</span>
        <Badge 
          variant="secondary" 
          className={`flex items-center gap-1 ${priorityConfig.bgColor} ${priorityConfig.textColor} border-0`}
        >
          <Icon className="h-3 w-3" />
          {priorityConfig.label}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Priority:</span>
      <Select 
        value={priority} 
        onValueChange={handlePriorityChange}
        disabled={loading}
      >
        <SelectTrigger className="w-32">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {priorityConfig.label}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map((option) => {
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
  );
}

export function PriorityBadge({ priority = "medium", className = "" }) {
  const priorityConfig = getPriorityConfig(priority);
  const Icon = priorityConfig.icon;

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 ${priorityConfig.bgColor} ${priorityConfig.textColor} border-0 ${className}`}
    >
      <Icon className="h-3 w-3" />
      {priorityConfig.label}
    </Badge>
  );
}

function getPriorityConfig(priorityValue) {
  return PRIORITY_OPTIONS.find(option => option.value === priorityValue) || PRIORITY_OPTIONS[1];
}
