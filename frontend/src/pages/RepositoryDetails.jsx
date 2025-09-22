import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssueList } from "@/components/IssueList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRepository, useRepositoryIssues } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { transformIssueForDisplay } from "@/utils/issueTransforms";
import { repoService } from "@/services/repoService";
import { toast } from "sonner";
import { 
  Star, 
  GitFork, 
  Eye, 
  Lock, 
  Edit, 
  Settings, 
  Plus,
  FileText,
  AlertCircle
} from "lucide-react";

export default function RepositoryDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isStarred, setIsStarred] = useState(false);
  
  // Debug logging
  console.log('RepositoryDetails - ID from params:', id);
  
  // Don't make API calls if id is missing
  const { data: repo, loading: repoLoading, error: repoError } = useRepository(id);
  const { data: apiIssues = [], loading: issuesLoading, error: issuesError } = useRepositoryIssues(id);
  
  // Debug logging
  console.log('Repository data:', { repo, repoLoading, repoError });

  // Early return if no ID is provided
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Repository not found</div>
            <p className="text-muted-foreground">Invalid repository ID.</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform API issues to UI issues
  const issues = useMemo(() => {
    if (!apiIssues || !Array.isArray(apiIssues)) return [];
    return apiIssues.map(issue => transformIssueForDisplay(issue));
  }, [apiIssues]);
  
  // Check if current user owns this repo
  const isOwner = repo && user && (
    typeof repo.owner === 'string' ? repo.owner === user._id : repo.owner._id === user._id
  );

  const handleStar = async () => {
    if (!repo || !user) return;
    
    try {
      if (isStarred) {
        await repoService.unstarRepository(repo._id);
        setIsStarred(false);
        toast.success("Repository unstarred");
      } else {
        await repoService.starRepository(repo._id);
        setIsStarred(true);
        toast.success("Repository starred");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update star status");
    }
  };

  if (repoLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading repository...</div>
          </div>
        </div>
      </div>
    );
  }

  if (repoError || !repo) {
    return (
      <div className="min-h-screen bg-white">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Repository not found</div>
            <Link to="/repositories">
              <Button>Back to Repositories</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ownerUsername = typeof repo.owner === 'string' ? 'Unknown' : repo.owner.username;

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Repository Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{ownerUsername.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link to={`/users/${ownerUsername}`} className="hover:underline text-muted-foreground">
                {ownerUsername}
              </Link>
              <span className="text-muted-foreground">/</span>
              <h1 className="text-2xl font-bold">{repo.name}</h1>
              {repo.visibility === false && (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground mb-4">{repo.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Updated {repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : 'Unknown'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Button 
                variant={isStarred ? "default" : "outline"} 
                size="sm"
                onClick={handleStar}
                className={isStarred ? "bg-gradient-primary" : "glass-button border-glass-border/30 hover:bg-green-100/70"}
                aria-label={isStarred ? "Unstar repository" : "Star repository"}
              >
                <Star className={`h-4 w-4 mr-1 ${isStarred ? "fill-current" : ""}`} />
                {isStarred ? "Starred" : "Star"}
              </Button>
              <Button variant="outline" size="sm" className="glass-button border-glass-border/30 hover:bg-green-100/70">
                <GitFork className="h-4 w-4 mr-1" />
                Fork
              </Button>
              <Button variant="outline" size="sm" className="glass-button border-glass-border/30 hover:bg-green-100/70">
                <Eye className="h-4 w-4 mr-1" />
                Watch
              </Button>
            </div>
            
            {isOwner && (
              <div className="flex gap-2">
                <Link to={`/repos/${repo._id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Repository Tabs */}
        <Tabs defaultValue="code">
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              Issues
              <Badge variant="secondary">{issues?.length || 0}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Repository Contents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {repo.content.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />  
                <h2 className="text-xl font-semibold">Issues</h2>
              </div>
              <Link to={`/repos/${repo._id}/issues/create`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Issue
                </Button>
              </Link>
            </div>
            
            {issuesLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading issues...</div>
              </div>
            ) : issuesError ? (
              <div className="text-center py-8">
                <div className="text-red-500">Error loading issues</div>
              </div>
            ) : (
              <IssueList 
                issues={issues || []}
                emptyMessage="No issues found for this repository."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
