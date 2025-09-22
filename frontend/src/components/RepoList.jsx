import { RepoCard } from "./RepoCard";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function RepoList({ repositories = [], onStar, starredRepos = [], loading, error, emptyMessage, className }) {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-card border-glass-border/50">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="glass-card border-glass-border/50">
        <CardContent className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading repositories</div>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <Card className="glass-card border-glass-border/50">
        <CardContent className="text-center py-12">
          <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No repositories found</h3>
          <p className="text-muted-foreground mb-4">
            {emptyMessage || "No repositories to display."}
          </p>
          <Button asChild className="bg-gradient-primary">
            <Link to="/repository/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Repository
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid gap-4 ${className || ''}`}>
      {repositories.map((repo) => (
        <RepoCard
          key={repo._id}
          repository={repo}
          onStar={onStar}
          isStarred={starredRepos.includes(repo._id)}
        />
      ))}
    </div>
  );
}
