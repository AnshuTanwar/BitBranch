import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { socialService } from "@/services/socialService";
import { toast } from "sonner";
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  GitBranch,
  Star,
  GitFork,
  UserPlus,
  UserMinus
} from "lucide-react";

export default function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const { data: user, loading, error } = useUser(id);
  
  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser && user && currentUser._id === user._id;

  const handleFollow = async () => {
    if (!user || !currentUser || isOwnProfile) return;
    
    try {
      if (isFollowing) {
        await socialService.unfollowUser(user._id);
        setIsFollowing(false);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await socialService.followUser(user._id);
        setIsFollowing(true);
        toast.success(`Following ${user.username}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading user profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-main">
        <AuthHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">User not found</div>
            <Button asChild>
              <Link to="/users">Back to Users</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For now, we'll use empty arrays for repositories since the backend doesn't have user-specific repo endpoints
  const repositories = [];

  return (
    <div className="min-h-screen bg-gradient-main">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-glass-border/50">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <p className="text-sm mb-4">BitBranch user</p>

                {/* Follow Button */}
                {!isOwnProfile && currentUser && (
                  <Button 
                    onClick={handleFollow}
                    className={isFollowing ? "bg-gradient-primary w-full mb-4" : "glass-button border-glass-border/30 hover:bg-green-100/70 w-full mb-4"}
                    variant={isFollowing ? "default" : "outline"}
                    aria-label={isFollowing ? `Unfollow ${user.username}` : `Follow ${user.username}`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-glass-border/30">
                  <Link to={`/users/${user._id}/followers`} className="text-center hover:bg-green-50/50 p-2 rounded transition-colors">
                    <div className="font-bold">0</div>
                    <div className="text-xs text-muted-foreground">followers</div>
                  </Link>
                  <Link to={`/users/${user._id}/following`} className="text-center hover:bg-green-50/50 p-2 rounded transition-colors">
                    <div className="font-bold">0</div>
                    <div className="text-xs text-muted-foreground">following</div>
                  </Link>
                  <div className="text-center">
                    <div className="font-bold">{repositories.length}</div>
                    <div className="text-xs text-muted-foreground">repos</div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-gradient-primary">
                  <Users className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="glass-card border-glass-border/30">
                <TabsTrigger value="repositories" className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>Repositories</span>
                  <Badge variant="secondary">{repositories.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="starred" className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Starred</span>
                  <Badge variant="secondary">0</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="repositories" className="mt-6">
                <Card className="glass-card border-glass-border/50">
                  <CardHeader>
                    <CardTitle>Public Repositories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No public repositories</h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile 
                          ? "Create your first repository to get started"
                          : `${user.username} doesn't have any public repositories yet`
                        }
                      </p>
                      {isOwnProfile && (
                        <Button asChild className="mt-4 bg-gradient-primary">
                          <Link to="/repository/new">
                            Create Repository
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="starred" className="mt-6">
                <Card className="glass-card border-glass-border/50">
                  <CardHeader>
                    <CardTitle>Starred Repositories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No starred repositories</h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile 
                          ? "Star repositories to see them here"
                          : `${user.username} hasn't starred any repositories yet`
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
