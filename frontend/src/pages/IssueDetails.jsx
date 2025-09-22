import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIssue, useIssueComments } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AuthHeader } from "@/components/ui/auth-header";
import { Comments } from "@/components/Comments";
import { IssueAssignment } from "@/components/IssueAssignment";
import { IssueLabels } from "@/components/IssueLabels";
import { IssuePriority } from "@/components/IssuePriority";
import { IssueStatus } from "@/components/IssueStatus";
import { useAuth } from "@/contexts/AuthContext";
import { issueService } from "@/services/issueService";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Edit, 
  Calendar,
  User,
  Trash2,
  Bug,
  CheckCircle,
  Clock
} from "lucide-react";

// Status utilities
const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'destructive';
    case 'closed': return 'secondary';
    case 'in-progress': return 'default';
    default: return 'secondary';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'open': return 'Open';
    case 'closed': return 'Closed';
    case 'in-progress': return 'In Progress';
    default: return 'Unknown';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'open': return <Bug className="h-4 w-4" />;
    case 'closed': return <CheckCircle className="h-4 w-4" />;
    case 'in-progress': return <Clock className="h-4 w-4" />;
    default: return <Bug className="h-4 w-4" />;
  }
};

export default function IssueDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await issueService.getIssueById(id);
      setIssue(response);
    } catch (error) {
      console.error("Error fetching issue:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueUpdate = (updatedData) => {
    setIssue(prev => ({ ...prev, ...updatedData }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Issue not found</div>
            <Button asChild className="bg-gradient-primary">
              <Link to="/issues">Back to Issues</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if current user can edit (author or repo owner)
  const canEdit = user && issue.author && (user._id === issue.author._id);

  return (
    <div className="min-h-screen bg-gradient-main">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/issues">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Issues
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Issue Header */}
            <Card className="glass-card border-glass-border/50 mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{issue.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={issue.author?.avatar} />
                          <AvatarFallback>{issue.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{issue.author?.username}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {canEdit && (
                    <Button asChild variant="outline" size="sm" className="glass-button border-glass-border/30">
                      <Link to={`/issues/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{issue.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Comments issueId={id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-glass-border/50">
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Management */}
                <IssueStatus 
                  issueId={id}
                  currentStatus={issue.status}
                  onStatusChange={(newStatus) => handleIssueUpdate({ status: newStatus })}
                  readOnly={!canEdit}
                />

                <Separator />

                {/* Priority Management */}
                <IssuePriority 
                  issueId={id}
                  currentPriority={issue.priority}
                  onPriorityChange={(newPriority) => handleIssueUpdate({ priority: newPriority })}
                  readOnly={!canEdit}
                />

                <Separator />

                {/* Assignment */}
                <IssueAssignment 
                  issueId={id}
                  currentAssignee={issue.assignee}
                  onAssigneeChange={(newAssignee) => handleIssueUpdate({ assignee: newAssignee })}
                />

                <Separator />

                {/* Labels */}
                <IssueLabels 
                  issueId={id}
                  currentLabels={issue.labels || []}
                  onLabelsChange={(newLabels) => handleIssueUpdate({ labels: newLabels })}
                />

                <Separator />

                {/* Author */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={issue.author?.avatar} />
                      <AvatarFallback>{issue.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{issue.author?.username}</span>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Created</label>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
