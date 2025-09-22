import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStarredRepositories } from "@/hooks/useApi";
import { 
  Star, 
  Search, 
  GitBranch, 
  Eye, 
  Lock,
  Calendar,
  User
} from "lucide-react";

export default function StarredRepositories() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: repositories = [], loading, error } = useStarredRepositories();

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error loading starred repositories</div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Star className="h-8 w-8 mr-3 text-yellow-500" />
                Starred Repositories
              </h1>
              <p className="text-lg text-muted-foreground">
                Repositories you've starred ({repositories.length})
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search starred repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-button border-glass-border/30"
              aria-label="Search starred repositories"
            />
          </div>
        </div>

        {/* Repositories Grid */}
        {filteredRepositories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepositories.map((repo) => (
              <Card key={repo._id} className="glass-card border-glass-border/50 hover:border-glass-border transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <GitBranch className="h-5 w-5" />
                        <Link 
                          to={`/repos/${repo._id}`}
                          className="hover:underline"
                        >
                          {repo.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {repo.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!repo.visibility && <Lock className="h-4 w-4 text-muted-foreground" />}
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{repo.owner}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(repo.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={repo.visibility ? "default" : "secondary"}>
                      {repo.visibility ? "Public" : "Private"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card border-glass-border/50">
            <CardContent className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No repositories match your search" : "No starred repositories"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "Star repositories to see them here"
                }
              </p>
              {!searchQuery && (
                <Button asChild className="bg-gradient-primary">
                  <Link to="/repos">
                    Browse Repositories
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
