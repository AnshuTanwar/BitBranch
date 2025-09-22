import { useState, useMemo } from "react";
import { UserCard } from "@/components/UserCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterDropdown } from "@/components/FilterDropdown";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useUsers } from "@/hooks/useApi";

const sortOptions = [
  { label: "Most Repositories", value: "repos" },
  { label: "Most Stars", value: "stars" },
  { label: "Most Followers", value: "followers" },
  { label: "Recently Joined", value: "recent" }
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  
  const { data: allUsers = [], loading, error } = useUsers();

  // Filter and sort users based on search and sort criteria
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = allUsers;

    // Apply search filter
    if (searchQuery) {
      filtered = allUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "repos":
            return (b.repositories?.length || 0) - (a.repositories?.length || 0);
          case "stars":
            return (b.totalStars || 0) - (a.totalStars || 0);
          case "followers":
            return (b.followers?.length || 0) - (a.followers?.length || 0);
          case "recent":
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [allUsers, searchQuery, sortBy]);

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
            <div className="text-red-500 mb-4">Error loading users</div>
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
          <h1 className="text-4xl font-bold mb-2">Discover Users</h1>
          <p className="text-lg text-muted-foreground">
            Connect with developers and explore their work
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search users..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex gap-2">
            <FilterDropdown
              label="Sort by"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "", label: "Default" },
                ...sortOptions
              ]}
            />
            <div className="flex border border-glass-border/30 rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Users Grid/List */}
        {filteredAndSortedUsers.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredAndSortedUsers.map((user) => (
              <UserCard 
                key={user._id} 
                user={user} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchQuery ? "No users match your search" : "No users found"}
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
