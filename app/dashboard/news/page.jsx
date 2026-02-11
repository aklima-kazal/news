"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.getNews();
        setNews(data);
      } catch (err) {
        toast.error("Failed to load news");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this news?")) return;
    setDeletingId(id);
    try {
      await api.deleteNews(id);
      setNews(news.filter((n) => n.id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete news");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>⏳ Loading news...</div>;

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl mb-4">All News</h1>
      {news.length === 0 ? (
        <p>No news yet.</p>
      ) : (
        news.map((n) => (
          <div
            key={n.id}
            className="flex justify-between p-3 hover:bg-slate-800/30 mb-1 rounded"
          >
            <div>
              <h3 className="font-medium">{n.title}</h3>
              {n.category && (
                <span className="text-sm text-gray-400">{n.category}</span>
              )}
            </div>
            <button
              onClick={() => handleDelete(n.id)}
              disabled={deletingId === n.id}
              className="px-2 py-1 bg-red-700 rounded"
            >
              {deletingId === n.id ? "..." : <Trash2 size={16} />}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
