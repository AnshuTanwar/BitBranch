import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useUserRepositories } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthHeader } from "@/components/ui/auth-header";
import { 
  GitBranch, 
  Plus, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { data: repositoriesData, loading: isLoading } = useUserRepositories();
  const repositories = repositoriesData || [];

  // Extract recent issues from repositories
  const recentIssues = useMemo(() => {
    if (!repositories || repositories.length === 0) return [];
    
    const allIssues = repositories
      .filter(repo => repo.issues && Array.isArray(repo.issues))
      .flatMap(repo => 
        repo.issues.map(issue => ({
          ...issue,
          repositoryName: repo.name,
          repositoryId: repo._id
        }))
      )
      .sort((a, b) => {
        const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 5); // Show only 5 most recent issues
    
    return allIssues;
  }, [repositories]);

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      <div className="p-4 max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back to <span className="bg-gradient-primary bg-clip-text text-transparent">BitBranch</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Manage your repositories, track issues, and collaborate with your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary">
              <Link to="/repository/new">
                <Plus className="h-5 w-5 mr-2" />
                Create Repository
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/repos/my">
                <GitBranch className="h-5 w-5 mr-2" />
                View My Repositories
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="glass-card border-glass-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{repositories.length}</div>
              <p className="text-xs text-muted-foreground">
                {repositories.filter(repo => repo.visibility).length} public, {repositories.filter(repo => !repo.visibility).length} private
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentIssues.filter(issue => issue.status === 'open').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all repositories
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentIssues.length}</div>
              <p className="text-xs text-muted-foreground">
                Issues updated recently
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Repositories */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Repositories</h2>
            <Button asChild variant="outline">
              <Link to="/repos/my">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass-card border-glass-border/50">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-muted rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : repositories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repositories.slice(0, 6).map((repo) => (
                <Card key={repo._id} className="glass-card border-glass-border/50 hover:border-glass-border transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <GitBranch className="h-4 w-4" />
                        <Link to={`/repos/${repo._id}`} className="hover:underline">
                          {repo.name}
                        </Link>
                      </CardTitle>
                      <Badge variant={repo.visibility ? "default" : "secondary"}>
                        {repo.visibility ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {repo.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{repo.issues?.length || 0} issues</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card border-glass-border/50">
              <CardContent className="text-center py-12">
                <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No repositories yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first repository to get started with BitBranch.
                </p>
                <Button asChild className="bg-gradient-primary">
                  <Link to="/repository/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Repository
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Issues */}
        {recentIssues.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Issues</h2>
              <Button asChild variant="outline">
                <Link to="/issues">View All Issues</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <Card key={issue._id} className="glass-card border-glass-border/50 hover:border-glass-border transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant={issue.status === 'open' ? 'destructive' : issue.status === 'closed' ? 'secondary' : 'default'}
                            className="text-xs"
                          >
                            {issue.status === 'open' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {issue.status === 'closed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {issue.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                            {issue.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {issue.repositoryName}
                          </span>
                        </div>
                        <Link 
                          to={`/issues/${issue._id}`}
                          className="font-medium hover:underline"
                        >
                          {issue.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {issue.description}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground ml-4">
                        {issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
