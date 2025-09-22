import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function SearchBar({ placeholder = "Search...", value, onChange, className }) {
  const [query, setQuery] = useState(value || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onChange) {
      onChange(query.trim());
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    // Real-time search as user types
    if (onChange) {
      onChange(newValue.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onChange) {
      onChange("");
    }
  };

  // Use controlled value if provided, otherwise use internal state
  const inputValue = value !== undefined ? value : query;

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className || ''}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={value !== undefined ? (e) => onChange(e.target.value) : handleChange}
          className="pl-10 pr-10 glass-button border-glass-border/30"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </form>
  );
}
