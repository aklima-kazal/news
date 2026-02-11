"use client";
import { useSearch } from "@/lib/SearchContext";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <input
      type="text"
      placeholder="Search news..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none"
    />
  );
}
