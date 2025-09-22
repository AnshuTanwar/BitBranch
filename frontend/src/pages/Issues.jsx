import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/SearchBar";
import { FilterDropdown } from "@/components/FilterDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIssues } from "@/hooks/useApi";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MessageCircle,
  Calendar,
  Plus
} from "lucide-react";

export default function Issues() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  
  const { data: issuesData, loading, error } = useIssues();
  const allIssues = issuesData || [];
  
  // Filter issues based on search and filters
  const filteredIssues = allIssues.filter(issue => {
    const matchesSearch = !searchQuery || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "oldest":
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case "updated":
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      default:
        return 0;
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "closed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-500";
      case "closed":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error loading issues</div>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Issues</h1>
            <p className="text-lg text-muted-foreground">
              Track and manage issues across all repositories
            </p>
          </div>
          <Button asChild className="bg-gradient-primary">
            <Link to="/issues/create">
              <Plus className="h-4 w-4 mr-2" />
              New Issue
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search issues..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex gap-2">
            <FilterDropdown
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "", label: "All Status" },
                { value: "open", label: "Open" },
                { value: "in-progress", label: "In Progress" },
                { value: "closed", label: "Closed" }
              ]}
            />
            <FilterDropdown
              label="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: "", label: "All Priority" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" }
              ]}
            />
            <FilterDropdown
              label="Sort"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "", label: "Default" },
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "updated", label: "Recently Updated" }
              ]}
            />
          </div>
        </div>

        {/* Issues List */}
        {sortedIssues.length > 0 ? (
          <div className="space-y-4">
            {sortedIssues.map((issue) => (
              <Card key={issue._id} className="glass-card border-glass-border/50 hover:border-glass-border transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(issue.status)}
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(issue.status)} text-white`}
                        >
                          {issue.status}
                        </Badge>
                        {issue.priority && (
                          <Badge 
                            variant="outline" 
                            className={getPriorityColor(issue.priority)}
                          >
                            {issue.priority}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {issue.repositoryName}
                        </span>
                      </div>
                      
                      <Link 
                        to={`/issues/${issue._id}`}
                        className="block hover:underline"
                      >
                        <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {issue.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {issue.author?.username?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span>{issue.author?.username || "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{issue.comments?.length || 0} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card border-glass-border/50">
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || statusFilter || priorityFilter 
                  ? "No issues match your filters" 
                  : "No issues found"
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter || priorityFilter
                  ? "Try adjusting your search or filters"
                  : "Create your first issue to get started"
                }
              </p>
              {!searchQuery && !statusFilter && !priorityFilter && (
                <Button asChild className="bg-gradient-primary">
                  <Link to="/issues/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Issue
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
