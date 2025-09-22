import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useFollowing, useUser } from "@/hooks/useApi";
import { 
  UserCheck, 
  Search, 
  ArrowLeft
} from "lucide-react";

export default function UserFollowing() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: user, loading: userLoading } = useUser(id || '');
  const { data: following = [], loading: followingLoading, error } = useFollowing(id || '');

  const filteredFollowing = following.filter(followedUser =>
    followedUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (followedUser.email && followedUser.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const loading = userLoading || followingLoading;

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
            <div className="text-red-500 mb-4">Error loading following</div>
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
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" asChild>
              <Link to={`/users/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <UserCheck className="h-8 w-8 mr-3" />
                {user?.username} is Following
              </h1>
              <p className="text-lg text-muted-foreground">
                Following {following.length} {following.length === 1 ? 'user' : 'users'}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search following..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-button border-glass-border/30"
              aria-label="Search following"
            />
          </div>
        </div>

        {/* Following Grid */}
        {filteredFollowing.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFollowing.map((followedUser) => (
              <Card key={followedUser._id} className="glass-card border-glass-border/50 hover:border-glass-border transition-colors">
                <CardHeader className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={followedUser.avatar} />
                    <AvatarFallback>{followedUser.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle>
                    <Link 
                      to={`/users/${followedUser._id}`}
                      className="hover:underline"
                    >
                      {followedUser.username}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {followedUser.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/users/${followedUser._id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card border-glass-border/50">
            <CardContent className="text-center py-12">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No users match your search" : "Not following anyone yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : `${user?.username} isn't following anyone yet`
                }
              </p>
              {!searchQuery && (
                <Button asChild className="bg-gradient-primary">
                  <Link to="/users">
                    Discover Users
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
