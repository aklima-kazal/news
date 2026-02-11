"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("📝 Please enter a category name.", { duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      await api.createCategory(name);
      toast.success("✨ Category created successfully!", { duration: 2000 });
      router.push("/dashboard/categories");
    } catch (error) {
      const message = error.message || "Failed to create category. Please try again.";
      toast.error(message, { duration: 3000 });
      console.error("Category creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Toaster />
      <h1 className="text-xl font-semibold text-white mb-6">Add Category</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-base font-medium text-gray-400 mb-3">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Politics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="outline-none input w-full text-white bg-slate-700 border border-slate-600 rounded-lg p-2 disabled:opacity-50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-8 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-amber-50 text-md font-medium cursor-pointer hover:scale-[105%] transition-all ease-in duration-300 hover:text-amber-200 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Save Category"}
          </button>

          <button
            type="button"
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-borderdark hover:bg-slate-600 text-md font-medium cursor-pointer text-emerald-200 hover:rotate-1 transition-all ease-in duration-200 disabled:opacity-50"
            onClick={() => setName("")}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
