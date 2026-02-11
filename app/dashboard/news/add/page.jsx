"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function AddNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load categories for selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("📝 Please fill in both title and content.", {
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await api.createNews(title, content, category || null, "published");
      toast.success("✨ News published successfully!", { duration: 2000 });
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to publish news.", { duration: 3000 });
      console.error("Publish error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error("⚠️ Title is required to save draft.", { duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      await api.createNews(title, content, category || null, "draft");
      toast.success("💾 Draft saved successfully!", { duration: 2000 });
      router.push("/dashboard/drafts");
    } catch (err) {
      toast.error(err.message || "Failed to save draft.", { duration: 3000 });
      console.error("Draft error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <Toaster />
      <h1 className="text-2xl text-pink-300 font-semibold mb-4">Add News</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 outline-none"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 outline-none h-32 resize-none"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 outline-none"
      >
        <option value="">Select category (optional)</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex gap-4">
        <button
          onClick={handlePublish}
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
        <button
          onClick={handleSaveDraft}
          disabled={loading}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>
      </div>
    </div>
  );
}
