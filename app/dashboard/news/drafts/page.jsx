"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Send } from "lucide-react";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, catsRes] = await Promise.all([
          api.getNews(),
          api.getCategories(),
        ]);
        setDrafts(newsRes.filter((n) => n.status === "draft"));
        setCategories(catsRes);
      } catch (err) {
        console.error("Failed to load drafts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (draft) => {
    setFormData({
      title: draft.title,
      content: draft.content,
      category: draft.category || "",
    });
    setEditingId(draft.id);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error("Title is required");

    setSavingId(editingId || "new");
    try {
      if (editingId) {
        await api.updateNews(editingId, formData);
        setDrafts(
          drafts.map((d) => (d.id === editingId ? { ...d, ...formData } : d)),
        );
        toast.success("Draft updated!");
      } else {
        const newDraft = await api.createNews(
          formData.title,
          formData.content,
          formData.category,
          "draft",
        );
        setDrafts([newDraft, ...drafts]);
        toast.success("Draft created!");
      }
      setEditingId(null);
      setFormData({ title: "", content: "", category: "" });
    } catch (err) {
      toast.error(err.message || "Failed to save draft");
    } finally {
      setSavingId(null);
    }
  };

  const handlePublish = async (draft) => {
    if (!confirm(`Publish "${draft.title}"?`)) return;
    setSavingId(draft.id);
    try {
      await api.updateNews(draft.id, { status: "published" });
      setDrafts(drafts.filter((d) => d.id !== draft.id));
      toast.success("Draft published!");
    } catch (err) {
      toast.error(err.message || "Failed to publish draft");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (draft) => {
    if (!confirm(`Delete "${draft.title}"?`)) return;
    setDeletingId(draft.id);
    try {
      await api.deleteNews(draft.id);
      setDrafts(drafts.filter((d) => d.id !== draft.id));
      toast.success("Draft deleted!");
    } catch (err) {
      toast.error(err.message || "Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-gray-300">⏳ Loading drafts...</div>;

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl text-yellow-400 font-semibold mb-4">
        Draft News
      </h1>

      {/* Draft form */}
      <div className="card mb-6 p-4 space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600"
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 resize-none h-28"
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={savingId !== null}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded py-2"
          >
            {savingId !== null ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>

      {/* Drafts list */}
      <div className="card">
        {drafts.length === 0 ? (
          <p className="text-gray-400 p-4">No drafts yet.</p>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className="flex justify-between items-center p-3 hover:bg-slate-800/30 rounded mb-1"
            >
              <div>
                <h3 className="text-white font-medium">{draft.title}</h3>
                {draft.category && (
                  <span className="text-xs text-gray-400">
                    {draft.category}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePublish(draft)}
                  disabled={savingId === draft.id}
                  className="px-2 py-1 bg-green-700 text-white rounded disabled:opacity-50"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleEdit(draft)}
                  className="px-2 py-1 bg-blue-700 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(draft)}
                  disabled={deletingId === draft.id}
                  className="px-2 py-1 bg-red-700 text-white rounded disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
