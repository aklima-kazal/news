"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function AddNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("📝 Please fill in both title and content fields.", {
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await api.createNews(title, content, category || null, "published");
      toast.success("✨ News published successfully!", { duration: 2000 });
      router.push("/dashboard/news");
    } catch (error) {
      const message =
        error.message || "Failed to publish news. Please try again.";
      toast.error(message, { duration: 3000 });
      console.error("Publish error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      <h1 className="text-xl text-pink-300 font-semibold mb-4">Add News</h1>

      <div className="card space-y-4 max-w-xl">
        <input
          className="input w-full text-lg font-normal border border-slate-600 outline-none bg-slate-700 text-white p-2 rounded-lg"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input w-full h-32 border border-slate-600 resize-none outline-none bg-slate-700 text-white p-2 rounded-lg"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="input w-full"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          onClick={handlePublish}
          disabled={loading}
          className="btn-primary text-lg font-medium text-[#ff0080] px-4 py-2 bg-purple-300 transition-all ease-in duration-300 cursor-pointer hover:rounded-md disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
