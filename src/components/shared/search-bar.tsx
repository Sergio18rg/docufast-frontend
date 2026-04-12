import { Search } from "lucide-react";
import { Input } from "../ui/input";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}) => {
  return (
    <div className="relative min-w-70">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
};

export { SearchBar };
