import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRepositories } from "@/hooks/useApi";
import { 
  GitBranch, 
  Star, 
  Users, 
  UserPlus, 
  Lock, 
  Globe,
  Calendar,
  Edit,
  Settings
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { data: repositories, loading: reposLoading, error: reposError } = useUserRepositories();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-radial">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">User not found</div>
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const publicRepos = repositories?.filter(repo => repo.visibility) || [];
  const privateRepos = repositories?.filter(repo => !repo.visibility) || [];
  const totalStars = repositories?.reduce((sum, repo) => sum + (repo.stars || 0), 0) || 0;
  
  // Get follower/following counts from user data
  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-main">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-glass-border/50 p-6">
              <div className="text-center mb-6">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="glass-button border-glass-border/30">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Profile editing coming soon!</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-glass-border/30">
                <div className="text-center">
                  <div className="font-bold">{repositories?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">repositories</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{totalStars}</div>
                  <div className="text-xs text-muted-foreground">stars</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{followersCount}</div>
                  <div className="text-xs text-muted-foreground">followers</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="glass-card border-glass-border/30">
                <TabsTrigger value="repositories" className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>Repositories</span>
                  <Badge variant="secondary">{repositories?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="starred" className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Starred</span>
                  <Badge variant="secondary">0</Badge>
                </TabsTrigger>
                <TabsTrigger value="followers" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Followers</span>
                  <Badge variant="secondary">{followersCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="following" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Following</span>
                  <Badge variant="secondary">{followingCount}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="repositories" className="mt-6">
                {reposLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : reposError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-4">Error loading repositories</div>
                    <p className="text-muted-foreground">{reposError}</p>
                  </div>
                ) : repositories && repositories.length > 0 ? (
                  <div className="space-y-4">
                    {repositories.map((repo, index) => (
                      <Card key={repo._id || `repo-${index}`} className="glass-card border-glass-border/50 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <GitBranch className="h-4 w-4" />
                              <h3 className="font-semibold">{repo.name}</h3>
                              {repo.visibility ? (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Public
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Private
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">
                              {repo.description || "No description provided"}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>{repo.stars || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="glass-button border-glass-border/30">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card border-glass-border/50">
                    <div className="text-center py-12">
                      <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No repositories yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first repository to get started.
                      </p>
                      <Button className="bg-gradient-primary">
                        Create Repository
                      </Button>
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="starred" className="mt-6">
                <Card className="glass-card border-glass-border/50">
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No starred repositories</h3>
                    <p className="text-muted-foreground">
                      Star repositories to see them here.
                    </p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="followers" className="mt-6">
                {followersCount > 0 ? (
                  <div className="space-y-4">
                    {user.followers.map((follower, index) => (
                      <Card key={follower._id || `follower-${index}`} className="glass-card border-glass-border/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{follower.username}</h4>
                              <p className="text-sm text-muted-foreground">{follower.email}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card border-glass-border/50">
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No followers yet</h3>
                      <p className="text-muted-foreground">
                        Connect with other developers to grow your network.
                      </p>
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="following" className="mt-6">
                {followingCount > 0 ? (
                  <div className="space-y-4">
                    {user.following.map((following, index) => (
                      <Card key={following._id || `following-${index}`} className="glass-card border-glass-border/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <UserPlus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{following.username}</h4>
                              <p className="text-sm text-muted-foreground">{following.email}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card border-glass-border/50">
                    <div className="text-center py-12">
                      <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Not following anyone</h3>
                      <p className="text-muted-foreground">
                        Follow developers to stay updated with their work.
                      </p>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
