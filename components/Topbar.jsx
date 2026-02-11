"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { logoutUser } from "@/lib/auth";
import { useSearch } from "@/lib/SearchContext";
import { api } from "@/lib/api";
import { Search, X, Filter, Menu } from "lucide-react";

export default function Topbar({ toggleSidebar }) {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState("all"); // all, news, categories
  const [newsData, setNewsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const inputRef = useRef(null);

  // Load news and categories data for suggestions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [newsRes, categoriesRes] = await Promise.all([
          api.getNews(),
          api.getCategories(),
        ]);
        setNewsData(newsRes || []);
        setCategoriesData(categoriesRes || []);
      } catch (error) {
        console.error("Failed to load search data:", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Generate dynamic suggestions
  const generateSuggestions = useCallback(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = [];

    if (filter === "all" || filter === "news") {
      newsData.forEach((item) => {
        if (
          item.title.toLowerCase().includes(query) &&
          matches.filter((m) => m.id === item.id).length === 0
        ) {
          matches.push({ id: item.id, title: item.title, type: "news" });
        }
      });
    }

    if (filter === "all" || filter === "categories") {
      categoriesData.forEach((cat) => {
        if (
          cat.name.toLowerCase().includes(query) &&
          matches.filter((m) => m.id === cat.id).length === 0
        ) {
          matches.push({ id: cat.id, title: cat.name, type: "category" });
        }
      });
    }

    setSuggestions(matches.slice(0, 5)); // Limit to 5 suggestions
  }, [searchQuery, filter, newsData, categoriesData]);

  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear & unfocus
      if (e.key === "Escape" && isFocused) {
        setSearchQuery("");
        setSuggestions([]);
        inputRef.current?.blur();
      }
      // Enter to navigate to search results page
      if (e.key === "Enter" && searchQuery.trim()) {
        router.push("/dashboard/search");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, setSearchQuery, searchQuery, router]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="bg-slate-800 shadow-md shadow-indigo-300/30">
      {/* Top section with Welcome and Logout */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="sm:hidden p-2 rounded-md bg-slate-700 text-gray-200"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <span className="text-green-200 text-3xl font-semibold">
            Welcome Admin
          </span>
        </div>
        <button
          onClick={() => {
            logoutUser();
            router.push("/login");
          }}
          className="bg-red-100 px-4 py-2 rounded text-base font-medium hover:bg-red-200 hover:scale-[101%] transition-all ease-in duration-200 cursor-pointer hover:rounded-xs shadow-md shadow-indigo-300/30 hover:rotate-2"
        >
          Logout
        </button>
      </div>

      {/* Bottom section with SearchBar */}
      <div className="px-6 py-4 space-y-3 ">
        {/* Filter buttons */}
        <div className="flex gap-2 items-center">
          <Filter size={20} className="text-gray-400 cursor-pointer" />
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1 rounded text-sm cursor-pointer font-medium transition-all ${
              filter === "all"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("news")}
            className={`px-3 py-1 rounded text-sm cursor-pointer font-medium transition-all ${
              filter === "news"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            News
          </button>
          <button
            onClick={() => handleFilterChange("categories")}
            className={`px-3 py-1 rounded text-sm cursor-pointer font-medium transition-all ${
              filter === "categories"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            Categories
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <div
            className={`flex items-center gap-3 bg-slate-700 rounded-lg px-4 py-2.5 transition-all duration-200 mt-4 ${
              isFocused
                ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20"
                : ""
            }`}
          >
            <Search className="text-cyan-400 cursor-pointer" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search... (Ctrl+K)"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm py-1"
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

          {/* Suggestions dropdown */}
          {isFocused && searchQuery && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700 rounded-lg shadow-lg border border-slate-600 z-50">
              <div className="py-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-600 transition-colors flex items-center gap-3 group"
                  >
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded">
                      {suggestion.type === "news" ? "📰" : "📁"}
                    </span>
                    <span className="text-white text-sm group-hover:text-cyan-300">
                      {suggestion.title}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => router.push("/dashboard/search")}
                className="w-full border-t border-slate-600 px-4 py-3 text-sm text-cyan-300 hover:text-cyan-200 hover:bg-slate-600/50 transition-colors text-left font-medium flex items-center justify-between group"
              >
                <span>View all results</span>
                <span className="text-xs bg-slate-600 px-2 py-1 rounded group-hover:bg-slate-500">
                  Enter
                </span>
              </button>
            </div>
          )}

          {/* No suggestions message */}
          {isFocused &&
            searchQuery &&
            suggestions.length === 0 &&
            !loadingData && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700 rounded-lg shadow-lg border border-slate-600 z-50 px-4 py-3">
                <p className="text-gray-400 text-sm">
                  No results found for "{searchQuery}"
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
