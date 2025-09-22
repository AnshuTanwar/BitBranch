import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Calendar } from "lucide-react";

export const IssueList = React.memo(({ issues, emptyMessage = "No issues found." }) => {
  if (issues.length === 0) {
    return (
      <Card className="glass-card border-glass-border/50">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-500";
      case "closed":
        return "bg-red-500";
      case "in-progress":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Open";
      case "closed":
        return "Closed";
      case "in-progress":
        return "In Progress";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="glass-card border-glass-border/50 hover:border-glass-border transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link 
                  to={`/issues/${issue.id}`}
                  className="hover:underline"
                >
                  <CardTitle className="text-lg mb-2">{issue.title}</CardTitle>
                </Link>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {issue.description}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className={`ml-4 ${getStatusColor(issue.status)} text-white`}
              >
                {getStatusText(issue.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={issue.author.avatar} />
                    <AvatarFallback>{issue.author.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{issue.author.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{issue.commentCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
