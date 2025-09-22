import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { repoService } from "@/services/repoService";
import { 
  Star, 
  GitFork, 
  Eye, 
  Users, 
  Calendar,
  Activity,
  Code,
  FileText,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export function RepositoryStats({ repositoryId, className = "" }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [repositoryId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // TODO: Backend endpoint doesn't exist yet, using mock data
      // const response = await repoService.getRepositoryStats(repositoryId);
      
      // Mock stats for now
      const mockStats = {
        totalCommits: Math.floor(Math.random() * 500) + 50,
        totalIssues: Math.floor(Math.random() * 50) + 5,
        openIssues: Math.floor(Math.random() * 20) + 2,
        closedIssues: Math.floor(Math.random() * 30) + 3,
        contributors: Math.floor(Math.random() * 10) + 1,
        stars: Math.floor(Math.random() * 100) + 10,
        forks: Math.floor(Math.random() * 25) + 2,
        languages: {
          JavaScript: 65,
          CSS: 20,
          HTML: 15
        }
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching repository stats:", error);
      toast.error("Failed to load repository statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No statistics available</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Stars",
      value: stats.stars || 0,
      icon: Star,
      description: "People who starred this repo",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Forks",
      value: stats.forks || 0,
      icon: GitFork,
      description: "Repository forks",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Watchers",
      value: stats.watchers || 0,
      icon: Eye,
      description: "People watching this repo",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Contributors",
      value: stats.contributors || 0,
      icon: Users,
      description: "Active contributors",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const activityData = [
    {
      label: "Issues",
      open: stats.issues?.open || 0,
      closed: stats.issues?.closed || 0,
      total: (stats.issues?.open || 0) + (stats.issues?.closed || 0)
    },
    {
      label: "Pull Requests",
      open: stats.pullRequests?.open || 0,
      closed: stats.pullRequests?.closed || 0,
      total: (stats.pullRequests?.open || 0) + (stats.pullRequests?.closed || 0)
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues & PRs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Overview
            </CardTitle>
            <CardDescription>
              Issues and pull requests status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityData.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.total} total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {item.open} open
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.closed} closed
                  </Badge>
                </div>
                {item.total > 0 && (
                  <Progress 
                    value={(item.closed / item.total) * 100} 
                    className="h-2"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Repository Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Repository Info
            </CardTitle>
            <CardDescription>
              Basic repository information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Size</p>
                <p className="text-lg font-semibold">
                  {stats.size ? `${(stats.size / 1024).toFixed(1)} KB` : 'N/A'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Language</p>
                <p className="text-lg font-semibold">
                  {stats.primaryLanguage || 'Not specified'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">
                  {stats.createdAt ? new Date(stats.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Updated</p>
                <p className="text-sm">
                  {stats.updatedAt ? new Date(stats.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {stats.topics && stats.topics.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Topics</p>
                <div className="flex flex-wrap gap-1">
                  {stats.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest repository activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Clock className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
