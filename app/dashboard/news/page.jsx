"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useSearch } from "@/lib/SearchContext";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2 } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.getNews();
        setNews(data);
      } catch (err) {
        const message =
          err.message || "Failed to load news. Please refresh the page.";
        setError(message);
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Filter news based on search query
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;

    const query = searchQuery.toLowerCase();
    return news.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.content && item.content.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)),
    );
  }, [news, searchQuery]);

  const handleDelete = async (id, title) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.deleteNews(id);

      // Update local state
      setNews(news.filter((item) => item.id !== id));

      toast.success("✨ News deleted successfully!", { duration: 2000 });
    } catch (error) {
      toast.error(`Failed to delete news: ${error.message}`, {
        duration: 3000,
      });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-gray-300">⏳ Loading news...</div>;
  if (error)
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
        <p className="font-semibold">⚠️ Error loading news</p>
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl text-rose-400 font-semibold mb-4">All News</h1>

      <div className="card">
        {filteredNews.length === 0 ? (
          <p className="text-gray-400">
            {searchQuery
              ? `No news found matching "${searchQuery}"`
              : "No news items yet."}
          </p>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-3 sm:py-4 sm:px-4 hover:bg-slate-800/30 transition-colors group gap-2 sm:gap-3"
                onClick={async (e) => {
                  // prevent triggering when clicking the delete button
                  if (e.target.closest("button")) return;
                  try {
                    await api.incrementNewsView(item.id);
                  } catch (err) {
                    console.error("View increment error", err);
                  }
                }}
                title="Click to record a view"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium group-hover:text-rose-300 transition-colors truncate text-sm sm:text-base">
                    {item.title}
                  </h3>
                  {item.content && (
                    <p className="text-gray-400 text-xs mt-1 truncate hidden sm:block">
                      {item.content.substring(0, 50)}...
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap ${
                      item.status === "published"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>

                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    title="Delete news"
                    aria-label="Delete news"
                  >
                    {deletingId === item.id ? (
                      <span className="text-xs animate-spin">⚙️</span>
                    ) : (
                      <Trash2 size={18} className="cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
