import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useFollowers, useUser } from "@/hooks/useApi";
import { 
  Users, 
  Search, 
  UserPlus,
  ArrowLeft
} from "lucide-react";

export default function UserFollowers() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: user, loading: userLoading } = useUser(id || '');
  const { data: followers = [], loading: followersLoading, error } = useFollowers(id || '');

  const filteredFollowers = followers.filter(follower =>
    follower.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (follower.email && follower.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const loading = userLoading || followersLoading;

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
            <div className="text-red-500 mb-4">Error loading followers</div>
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
                <Users className="h-8 w-8 mr-3" />
                {user?.username}'s Followers
              </h1>
              <p className="text-lg text-muted-foreground">
                {followers.length} {followers.length === 1 ? 'follower' : 'followers'}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search followers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-button border-glass-border/30"
              aria-label="Search followers"
            />
          </div>
        </div>

        {/* Followers Grid */}
        {filteredFollowers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFollowers.map((follower) => (
              <Card key={follower._id} className="glass-card border-glass-border/50 hover:border-glass-border transition-colors">
                <CardHeader className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={follower.avatar} />
                    <AvatarFallback>{follower.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle>
                    <Link 
                      to={`/users/${follower._id}`}
                      className="hover:underline"
                    >
                      {follower.username}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {follower.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/users/${follower._id}`}>
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
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No followers match your search" : "No followers yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : `${user?.username} doesn't have any followers yet`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
