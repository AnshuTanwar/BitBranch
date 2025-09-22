import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, GitBranch } from "lucide-react";
import { useRepository, useUserRepositories } from "@/hooks/useApi";
import { issueService } from "@/services/issueService";
import { AuthHeader } from "@/components/ui/auth-header";

export default function CreateIssue() {
  const { id } = useParams(); // Repository ID from URL (optional)
  const navigate = useNavigate();
  
  // State for form
  const [selectedRepoId, setSelectedRepoId] = useState(id || '');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user repositories for selector
  const { data: repositoriesData, loading: reposLoading } = useUserRepositories();
  const repositories = repositoriesData || [];
  
  // Always call useRepository with selectedRepoId (even if empty)
  // The hook will handle empty/invalid IDs internally
  const { data: repo, loading: repoLoading, error: repoError } = useRepository(selectedRepoId);
  
  // Use repo data directly
  const validRepo = repo;

  // Debug logging
  console.log('CreateIssue - Repository ID from URL:', id);
  console.log('CreateIssue - Selected Repository ID:', selectedRepoId);
  console.log('CreateIssue - Available repositories:', repositories);
  console.log('CreateIssue - Repository data:', { repo, repoLoading, repoError });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Issue title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRepoId) {
      toast({
        title: "Validation Error",
        description: "Please select a repository.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const issueData = {
        title: title.trim(),
        description: description.trim(),
        status: 'open',
        priority: 'medium'
      };

      const response = await issueService.createIssue(selectedRepoId, issueData);
      
      toast({
        title: "Issue created successfully!",
        description: `"${title}" has been created.`,
      });

      // Navigate to the created issue
      navigate(`/issues/${response._id}`);
    } catch (error) {
      console.error('Error creating issue:', error);
      toast({
        title: "Error creating issue",
        description: error.message || "Failed to create issue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (reposLoading) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to={id ? `/repos/${id}` : "/repos/my"}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {id && validRepo ? `Back to ${validRepo.name}` : "Back to Repositories"}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Issue</h1>
            <p className="text-lg text-muted-foreground">
              {id && validRepo 
                ? `Report a bug, request a feature, or start a discussion for ${validRepo.name}`
                : "Report a bug, request a feature, or start a discussion"
              }
            </p>
          </div>

          {/* Create Issue Form */}
          <Card className="glass-card border-glass-border/50">
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Repository Selector - only show if no repository ID in URL */}
                {!id && (
                  <div className="space-y-2">
                    <Label htmlFor="repository">Repository *</Label>
                    <Select value={selectedRepoId} onValueChange={setSelectedRepoId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a repository">
                          {selectedRepoId && repositories.find(r => r._id === selectedRepoId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {repositories.length > 0 ? (
                          repositories.map((repository) => (
                            <SelectItem key={repository._id} value={repository._id}>
                              <div className="flex items-center space-x-2">
                                <GitBranch className="h-4 w-4" />
                                <span>{repository.name}</span>
                                {!repository.visibility && <span className="text-xs text-muted-foreground">(Private)</span>}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No repositories found. Create a repository first.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="glass-button border-glass-border/30"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the issue, including steps to reproduce, expected behavior, and any relevant information..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-button border-glass-border/30 min-h-[200px]"
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground">
                    You can use Markdown to format your description
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-primary"
                    disabled={isLoading || !title.trim()}
                  >
                    {isLoading ? (
                      "Creating..."
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Issue
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="glass-button border-glass-border/30"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
