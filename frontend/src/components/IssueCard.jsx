import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Edit
} from "lucide-react";

export function IssueCard({ 
  issue, 
  showRepository = false, 
  onEdit, 
  onStatusChange,
  className 
}) {
  const statusConfig = {
    open: {
      icon: AlertCircle,
      color: 'destructive',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600'
    },
    closed: {
      icon: CheckCircle2,
      color: 'secondary',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600'
    },
    'in-progress': {
      icon: Clock,
      color: 'default',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600'
    }
  };

  const priorityConfig = {
    low: { color: 'secondary', label: 'Low' },
    medium: { color: 'default', label: 'Medium' },
    high: { color: 'destructive', label: 'High' }
  };

  const StatusIcon = statusConfig[issue.status].icon;

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

  const issueLink = issue.repoId 
    ? `/repos/${issue.repoId}/issues/${issue._id}`
    : `/issues/${issue._id}`;

  return (
    <Card className={`glass-card border-glass-border/50 hover:border-glass-border transition-colors ${className || ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${statusConfig[issue.status].bgColor}`}>
              <StatusIcon className={`h-4 w-4 ${statusConfig[issue.status].textColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Link 
                  to={issueLink}
                  className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                >
                  {issue.title}
                </Link>
                <Badge variant={statusConfig[issue.status].color}>
                  {issue.status}
                </Badge>
                {issue.priority && (
                  <Badge variant={priorityConfig[issue.priority].color} className="text-xs">
                    {priorityConfig[issue.priority].label}
                  </Badge>
                )}
              </div>
              
              {issue.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {issue.description}
                </p>
              )}

              {showRepository && issue.repositoryName && (
                <div className="mb-3">
                  <Link 
                    to={`/repos/${issue.repositoryId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {issue.repositoryName}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(issue._id)}
              className="ml-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={issue.author?.avatar} alt={issue.author?.username} />
                <AvatarFallback className="text-xs">
                  {issue.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span>{issue.author?.username || 'Unknown'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(issue.createdAt)}</span>
            </div>
            
            {issue.commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{issue.commentCount}</span>
              </div>
            )}
          </div>

          {onStatusChange && (
            <div className="flex gap-1">
              {issue.status === 'open' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(issue._id, 'closed')}
                  className="text-xs glass-button border-glass-border/30"
                >
                  Close
                </Button>
              )}
              {issue.status === 'closed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(issue._id, 'open')}
                  className="text-xs glass-button border-glass-border/30"
                >
                  Reopen
                </Button>
              )}
              {issue.status !== 'in-progress' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(issue._id, 'in-progress')}
                  className="text-xs glass-button border-glass-border/30"
                >
                  In Progress
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
