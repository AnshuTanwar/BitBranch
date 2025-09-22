import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRepository, useRepositoryIssues } from "@/hooks/useApi";
import { AuthHeader } from "@/components/ui/auth-header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssueList } from "@/components/IssueList";
import { Search, Plus, Bug, CheckCircle, Clock } from "lucide-react";
import { transformIssueForDisplay } from "@/utils/issueTransforms";

export default function RepositoryIssues() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("open");

  // Keyboard navigation handler
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && searchQuery) {
      setSearchQuery("");
    }
  };

  const { data: repository, loading: repoLoading, error: repoError } = useRepository(id || '');
  const { data: apiIssuesData, loading: issuesLoading, error: issuesError } = useRepositoryIssues(id || '');
  const allApiIssues = apiIssuesData || [];

  // Transform API issues to UI issues
  const allIssues = useMemo(() => {
    return allApiIssues.map(issue => transformIssueForDisplay(issue));
  }, [allApiIssues]);

  const filteredIssues = useMemo(() => {
    return allIssues.filter(issue => {
      const matchesSearch = searchQuery === "" || 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === "all" || issue.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [allIssues, searchQuery, activeTab]);

  const getIssueCount = (status) => {
    if (status === "all") return allIssues.length;
    return allIssues.filter(issue => issue.status === status).length;
  };

  const getTabIcon = (status) => {
    switch (status) {
      case "open":
        return <Bug className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      default:
        return <Bug className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <Link to={`/users/${repository.owner}`} className="hover:underline">
              {repository.owner}
            </Link>
            <span>/</span>
            <Link to={`/repos/${repository.id}`} className="hover:underline">
              {repository.name}
            </Link>
            <span>/</span>
            <span>Issues</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Issues</h1>
              <p className="text-lg text-muted-foreground">
                Track bugs, feature requests, and other issues
              </p>
            </div>
            <Button asChild className="bg-gradient-primary">
              <Link 
                to={`/repos/${repository.id}/issues/create`}
                aria-label="Create new issue for this repository"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Issue
              </Link>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues... (Press Escape to clear)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 glass-button border-glass-border/30"
              aria-label="Search issues by title or description"
            />
          </div>
        </div>

        {/* Issue Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" aria-label="Issue status filter">
          <TabsList className="glass-card border-glass-border/30">
            <TabsTrigger value="open" className="flex items-center space-x-2" aria-label="Show open issues">
              {getTabIcon("open")}
              <span>Open</span>
              <Badge variant="secondary">{getIssueCount("open")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="flex items-center space-x-2" aria-label="Show in-progress issues">
              {getTabIcon("in-progress")}
              <span>In Progress</span>
              <Badge variant="secondary">{getIssueCount("in-progress")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="closed" className="flex items-center space-x-2" aria-label="Show closed issues">
              {getTabIcon("closed")}
              <span>Closed</span>
              <Badge variant="secondary">{getIssueCount("closed")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2" aria-label="Show all issues">
              <Bug className="h-4 w-4" />
              <span>All</span>
              <Badge variant="secondary">{getIssueCount("all")}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {filteredIssues.length > 0 ? (
              <IssueList 
                issues={filteredIssues}
                emptyMessage={`No ${activeTab === "all" ? "" : activeTab} issues found.`}
              />
            ) : (
              <Card className="glass-card border-glass-border/50">
                <CardContent className="text-center py-12">
                  <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery 
                      ? "No issues match your search" 
                      : `No ${activeTab === "all" ? "" : activeTab} issues`
                    }
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try adjusting your search terms"
                      : `There are no ${activeTab === "all" ? "" : activeTab} issues for this repository.`
                    }
                  </p>
                  {!searchQuery && activeTab === "open" && (
                    <Button asChild className="bg-gradient-primary">
                      <Link 
                        to={`/repos/${repository.id}/issues/create`}
                        aria-label="Create your first issue for this repository"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first issue
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
