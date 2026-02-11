"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch = null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 shadow-sm">
      <div
        className={`flex items-center gap-3 bg-slate-700 rounded-lg px-4 py-2.5 transition-all duration-200 ${
          isFocused ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20" : ""
        }`}
      >
        <Search className="text-cyan-400" size={20} />
        <input
          type="text"
          placeholder="Search news, categories, or anything..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
