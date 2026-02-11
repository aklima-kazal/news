"use client";

import { useSearch } from "@/lib/SearchContext";

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <header className="flex items-center justify-between p-4 bg-slate-800 text-white">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-3 py-1 rounded bg-slate-700 placeholder-gray-400 outline-none text-white"
      />
    </header>
  );
}
