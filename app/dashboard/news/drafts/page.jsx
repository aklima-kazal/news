"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Send, X } from "lucide-react";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  // Fetch drafts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, catsRes] = await Promise.all([
          api.getNews(),
          api.getCategories(),
        ]);
        setDrafts(newsRes.filter((item) => item.status === "draft"));
        setCategories(catsRes);
      } catch (err) {
        const message =
          err.message || "Failed to load drafts. Please refresh the page.";
        setError(message);
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (draft) => {
    setFormData({
      title: draft.title,
      content: draft.content,
      category: draft.category || "",
    });
    setEditingId(draft.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("⚠️ Title is required", { duration: 2000 });
      return;
    }

    setSavingId(editingId);
    try {
      if (editingId) {
        // Update existing draft
        await api.updateNews(editingId, {
          title: formData.title,
          content: formData.content,
          category: formData.category,
        });
        setDrafts(
          drafts.map((d) =>
            d.id === editingId
              ? {
                  ...d,
                  title: formData.title,
                  content: formData.content,
                  category: formData.category,
                }
              : d,
          ),
        );
        toast.success("✨ Draft updated!", { duration: 2000 });
      } else {
        // Create new draft
        const newDraft = await api.createNews(
          formData.title,
          formData.content,
          formData.category,
          "draft",
        );
        setDrafts([newDraft, ...drafts]);
        toast.success("✨ Draft created!", { duration: 2000 });
      }
      resetForm();
    } catch (error) {
      toast.error(`Failed: ${error.message}`, { duration: 3000 });
      console.error("Save error:", error);
    } finally {
      setSavingId(null);
    }
  };

  const handlePublish = async (id, title) => {
    const confirmed = window.confirm(
      `Publish "${title}"? This will move it to published news.`,
    );
    if (!confirmed) return;

    setSavingId(id);
    try {
      await api.updateNews(id, { status: "published" });
      setDrafts(drafts.filter((d) => d.id !== id));
      toast.success("🚀 News published!", { duration: 2000 });
    } catch (error) {
      toast.error(`Failed: ${error.message}`, { duration: 3000 });
      console.error("Publish error:", error);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Delete "${title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.deleteNews(id);
      setDrafts(drafts.filter((d) => d.id !== id));
      toast.success("✨ Draft deleted!", { duration: 2000 });
    } catch (error) {
      toast.error(`Failed: ${error.message}`, { duration: 3000 });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-gray-300">⏳ Loading drafts...</div>;

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-2xl text-yellow-400 font-semibold">Draft News</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium w-full sm:w-auto"
          >
            + New Draft
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
          <p className="font-semibold">⚠️ Error loading drafts</p>
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">
              {editingId ? "Edit Draft" : "Create New Draft"}
            </h2>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title="Close form"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="News title"
                className="w-full px-3 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your news content here..."
                rows={5}
                className="w-full px-3 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors resize-none text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-base"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={savingId !== null}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {savingId !== null ? (
                  <>
                    <span className="animate-spin">⚙️</span> Saving...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Save Draft
                  </>
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={savingId !== null}
                className="px-4 py-2.5 sm:py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drafts List */}
      <div className="card">
        {drafts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg mb-4">
              📝 No drafts yet. Create one to get started!
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
              >
                Create First Draft
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="py-3 px-3 sm:py-4 sm:px-4 hover:bg-slate-800/30 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium group-hover:text-yellow-300 transition-colors truncate text-sm sm:text-base">
                      {draft.title}
                    </h3>
                    {draft.content && (
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                        {draft.content}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {draft.category && (
                        <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                          {draft.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Updated{" "}
                        {new Date(
                          draft.updatedAt || draft.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePublish(draft.id, draft.title)}
                      disabled={savingId === draft.id}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-900/30 hover:bg-green-900/50 text-green-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors font-medium whitespace-nowrap"
                      title="Publish draft"
                    >
                      {savingId === draft.id ? "⚙️" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleEdit(draft)}
                      disabled={savingId === draft.id}
                      className="p-1.5 sm:p-2 rounded hover:bg-blue-900/30 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      title="Edit draft"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(draft.id, draft.title)}
                      disabled={deletingId === draft.id}
                      className="p-1.5 sm:p-2 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      title="Delete draft"
                    >
                      {deletingId === draft.id ? (
                        <span className="text-xs animate-spin">⚙️</span>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
