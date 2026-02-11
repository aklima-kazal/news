"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useSearch } from "@/lib/SearchContext";
import { ChevronRight, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SearchResultsPage() {
  const { searchQuery } = useSearch();
  const [allData, setAllData] = useState({ news: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [newsRes, categoriesRes] = await Promise.all([
          api.getNews(),
          api.getCategories(),
        ]);
        setAllData({
          news: newsRes || [],
          categories: categoriesRes || [],
        });
      } catch (err) {
        const message = err.message || "Failed to load search data.";
        setError(message);
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Filter all data based on search query
  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return { news: [], categories: [] };
    }

    const query = searchQuery.toLowerCase();

    return {
      news: allData.news.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.content && item.content.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query))
      ),
      categories: allData.categories.filter((cat) =>
        cat.name.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery, allData]);

  const totalResults = results.news.length + results.categories.length;

  const handleDeleteNews = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.deleteNews(id);
      setAllData({
        ...allData,
        news: allData.news.filter((item) => item.id !== id),
      });
      toast.success("✨ News deleted successfully!", { duration: 2000 });
    } catch (error) {
      toast.error(`Failed to delete news: ${error.message}`, { duration: 3000 });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.deleteCategory(id);
      setAllData({
        ...allData,
        categories: allData.categories.filter((cat) => cat.id !== id),
      });
      toast.success("✨ Category deleted successfully!", { duration: 2000 });
    } catch (error) {
      toast.error(`Failed to delete category: ${error.message}`, { duration: 3000 });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!searchQuery) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">
          🔍 Enter a search term to see results
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-gray-300">⏳ Loading data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
        <p className="font-semibold">⚠️ Error loading search data</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Search Results</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Found <span className="font-semibold text-cyan-400">{totalResults}</span> result
          {totalResults !== 1 ? "s" : ""} for{" "}
          <span className="font-semibold text-cyan-300">"{searchQuery}"</span>
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 sm:p-8 text-center">
          <p className="text-gray-400 text-base sm:text-lg mb-2">No results found</p>
          <p className="text-gray-500 text-sm">
            Try a different search term or check the spelling
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* News Results */}
          {results.news.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-rose-400">
                  📰 News
                </h2>
                <span className="text-xs sm:text-sm bg-rose-900/20 text-rose-300 px-2 py-1 rounded">
                  {results.news.length}
                </span>
              </div>
              <div className="card space-y-0">
                {results.news.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-3 sm:py-4 sm:px-4 border-b border-slate-700 last:border-none hover:bg-slate-800/50 transition-colors group gap-2 sm:gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium group-hover:text-rose-300 transition-colors truncate text-sm sm:text-base">
                        {item.title}
                      </h3>
                      {item.content && (
                        <p className="text-gray-400 text-xs sm:text-sm truncate mt-1 hidden sm:block">
                          {item.content.substring(0, 60)}...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end shrink-0">
                      <span className="text-xs sm:text-sm bg-slate-700 text-gray-300 px-2 py-1 rounded whitespace-nowrap">
                        {item.status}
                      </span>
                      <button
                        disabled={deletingId === item.id}
                        onClick={() => handleDeleteNews(item.id, item.title)}
                        className="p-2 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        title="Delete news"
                      >
                        {deletingId === item.id ? (
                          <span className="text-xs animate-spin">⚙️</span>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Results */}
          {results.categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-pink-300">
                  📁 Categories
                </h2>
                <span className="text-xs sm:text-sm bg-pink-900/20 text-pink-300 px-2 py-1 rounded">
                  {results.categories.length}
                </span>
              </div>
              <div className="card space-y-0">
                {results.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between py-3 px-3 sm:py-4 sm:px-4 border-b border-slate-700 last:border-none hover:bg-slate-800/50 transition-colors group gap-2 sm:gap-3"
                  >
                    <h3 className="text-white font-medium group-hover:text-pink-300 transition-colors truncate text-sm sm:text-base flex-1">
                      {cat.name}
                    </h3>
                    <button
                      disabled={deletingId === cat.id}
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      title="Delete category"
                    >
                      {deletingId === cat.id ? (
                        <span className="text-xs animate-spin">⚙️</span>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
