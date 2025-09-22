import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { issueService } from "@/services/issueService";
import { Tag, Plus, X } from "lucide-react";
import { toast } from "sonner";

const PREDEFINED_LABELS = [
  { name: "bug", color: "bg-red-500" },
  { name: "enhancement", color: "bg-blue-500" },
  { name: "documentation", color: "bg-green-500" },
  { name: "help wanted", color: "bg-purple-500" },
  { name: "good first issue", color: "bg-yellow-500" },
  { name: "priority: high", color: "bg-red-600" },
  { name: "priority: medium", color: "bg-orange-500" },
  { name: "priority: low", color: "bg-gray-500" },
];

export function IssueLabels({ issueId, currentLabels = [], onLabelsChange }) {
  const [labels, setLabels] = useState(currentLabels);
  const [newLabel, setNewLabel] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLabels(currentLabels);
  }, [currentLabels]);

  const updateIssueLabels = async (updatedLabels) => {
    try {
      setLoading(true);
      await issueService.updateIssue(issueId, { labels: updatedLabels });
      
      setLabels(updatedLabels);
      
      if (onLabelsChange) {
        onLabelsChange(updatedLabels);
      }
      
      toast.success("Labels updated successfully");
    } catch (error) {
      console.error("Error updating labels:", error);
      toast.error("Failed to update labels");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLabel = async (labelName) => {
    if (!labelName.trim() || labels.includes(labelName.trim())) return;
    
    const updatedLabels = [...labels, labelName.trim()];
    await updateIssueLabels(updatedLabels);
    setNewLabel("");
  };

  const handleRemoveLabel = async (labelToRemove) => {
    const updatedLabels = labels.filter(label => label !== labelToRemove);
    await updateIssueLabels(updatedLabels);
  };

  const handleAddCustomLabel = (e) => {
    e.preventDefault();
    if (newLabel.trim()) {
      handleAddLabel(newLabel);
    }
  };

  const getLabelColor = (labelName) => {
    const predefined = PREDEFINED_LABELS.find(
      label => label.name.toLowerCase() === labelName.toLowerCase()
    );
    return predefined?.color || "bg-gray-500";
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground">Labels:</span>
      
      {/* Display current labels */}
      {labels.map((label) => (
        <Badge 
          key={label} 
          variant="secondary" 
          className={`flex items-center gap-1 ${getLabelColor(label)} text-white`}
        >
          <Tag className="h-3 w-3" />
          <span className="text-xs">{label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-white/20"
            onClick={() => handleRemoveLabel(label)}
            disabled={loading}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      {/* Add label button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Label
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Add Labels</h4>
            
            {/* Custom label input */}
            <form onSubmit={handleAddCustomLabel} className="flex gap-2">
              <Input
                placeholder="Enter custom label..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={!newLabel.trim() || loading}>
                Add
              </Button>
            </form>
            
            {/* Predefined labels */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick add:</p>
              <div className="flex flex-wrap gap-1">
                {PREDEFINED_LABELS
                  .filter(predefinedLabel => !labels.includes(predefinedLabel.name))
                  .map((predefinedLabel) => (
                    <Button
                      key={predefinedLabel.name}
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleAddLabel(predefinedLabel.name)}
                      disabled={loading}
                    >
                      <div className={`w-2 h-2 rounded-full mr-1 ${predefinedLabel.color}`} />
                      {predefinedLabel.name}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
