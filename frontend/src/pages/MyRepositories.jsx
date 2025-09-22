import { useState } from "react";
import { RepoList } from "@/components/RepoList";
import { SearchBar } from "@/components/SearchBar";
import { FilterDropdown } from "@/components/FilterDropdown";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useUserRepositories } from "@/hooks/useApi";

export default function MyRepositories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [filterBy, setFilterBy] = useState("all");
  
  const { data: repositories, loading, error } = useUserRepositories();

  // Filter and sort repositories
  const filteredRepos = (repositories || [])
    .filter((repo) => {
      const matchesSearch = repo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        !filterBy ||
        (filterBy === "public" && repo.visibility === true) ||
        (filterBy === "private" && repo.visibility === false);
      return matchesSearch && matchesFilter;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Repositories</h1>
          <p className="text-muted-foreground">
            Manage and organize your repositories
          </p>
        </div>
        <Button asChild>
          <Link to="/repository/new">
            <Plus className="h-4 w-4 mr-2" />
            New Repository
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            label="Sort by"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "updated", label: "Last Updated" },
              { value: "created", label: "Created" },
              { value: "name", label: "Name" }
            ]}
          />
          <FilterDropdown
            label="Filter"
            value={filterBy}
            onChange={setFilterBy}
            options={[
              { value: "all", label: "All" },
              { value: "public", label: "Public" },
              { value: "private", label: "Private" }
            ]}
          />
        </div>
      </div>

      <RepoList 
        repositories={filteredRepos}
        loading={loading}
        error={error}
        emptyMessage="You haven't created any repositories yet. Create your first repository to get started!"
      />
    </div>
  );
}
