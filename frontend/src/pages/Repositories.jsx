import { useState } from "react";
import { RepoList } from "@/components/RepoList";
import { SearchBar } from "@/components/SearchBar";
import { FilterDropdown } from "@/components/FilterDropdown";
import { AuthHeader } from "@/components/ui/auth-header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUserRepositories } from "@/hooks/useApi";
import { Plus } from "lucide-react";

export default function Repositories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  
  const { data: allRepositories, loading, error } = useUserRepositories();

  // Filter and sort repositories
  const filteredRepos = (allRepositories || [])
    .filter((repo) => {
      const matchesSearch = !searchQuery || 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVisibility = !visibilityFilter ||
        (visibilityFilter === "public" && repo.visibility === true) ||
        (visibilityFilter === "private" && repo.visibility === false);
      return matchesSearch && matchesVisibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        case "created":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

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
            <div className="text-red-500 mb-4">Error loading repositories</div>
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
            <h1 className="text-4xl font-bold mb-2">My Repositories</h1>
            <p className="text-lg text-muted-foreground">
              Manage and organize your repositories
            </p>
          </div>
          <Button asChild className="bg-gradient-primary">
            <Link to="/repository/new">
              <Plus className="h-4 w-4 mr-2" />
              New Repository
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search repositories..."
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
                { value: "name", label: "Name" },
                { value: "updated", label: "Last Updated" },
                { value: "created", label: "Created" }
              ]}
            />
            <FilterDropdown
              label="Visibility"
              value={visibilityFilter}
              onChange={setVisibilityFilter}
              options={[
                { value: "", label: "All" },
                { value: "public", label: "Public" },
                { value: "private", label: "Private" }
              ]}
            />
          </div>
        </div>

        {/* Repository List */}
        <RepoList 
          repositories={filteredRepos}
          emptyMessage={
            searchQuery || visibilityFilter 
              ? "No repositories match your filters"
              : "You haven't created any repositories yet"
          }
        />
      </main>
    </div>
  );
}
