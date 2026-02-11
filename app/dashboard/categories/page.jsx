"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useSearch } from "@/lib/SearchContext";
import toast, { Toaster } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        const message =
          err.message || "Failed to load categories. Please refresh the page.";
        setError(message);
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(query));
  }, [categories, searchQuery]);

  const handleDelete = async (id, name) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.deleteCategory(id);

      // Update local state
      setCategories(categories.filter((cat) => cat.id !== id));

      toast.success("✨ Category deleted successfully!", { duration: 2000 });
    } catch (error) {
      toast.error(`Failed to delete category: ${error.message}`, {
        duration: 3000,
      });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return <div className="text-gray-300">⏳ Loading categories...</div>;
  if (error)
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
        <p className="font-semibold">⚠️ Error loading categories</p>
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl text-pink-300 font-semibold mb-4">Categories</h1>

      <div className="card">
        {filteredCategories.length === 0 ? (
          <p className="text-gray-400 p-4">
            {searchQuery
              ? `No categories found matching "${searchQuery}"`
              : "No categories yet."}
          </p>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between py-3 px-3 sm:py-4 sm:px-4 hover:bg-slate-800/30 transition-colors group gap-2 sm:gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium group-hover:text-pink-300 transition-colors truncate text-sm sm:text-base">
                    {cat.name}
                  </h3>
                </div>

                <button
                  disabled={deletingId === cat.id}
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  title="Delete category"
                  aria-label="Delete category"
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
        )}
      </div>
    </div>
  );
}
