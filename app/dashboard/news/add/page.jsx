"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!name.trim()) {
      toast.error("📝 Please enter a category name.", { duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      // Call API to add category
      await api.addCategory({ name: name.trim() });

      toast.success("✨ Category created successfully!", { duration: 2000 });

      // Navigate back to categories list
      router.push("/dashboard/categories");
    } catch (error) {
      const message =
        error?.message || "Failed to create category. Please try again.";
      toast.error(message, { duration: 3000 });
      console.error("Category creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-semibold text-white mb-6">Add Category</h1>

      <form
        onSubmit={handleSubmit}
        className="card space-y-4 p-6 bg-slate-800 rounded-lg shadow-md"
      >
        {/* Category Name */}
        <div>
          <label className="block text-base font-medium text-gray-400 mb-2">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Politics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-pink-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Save Category"}
          </button>

          <button
            type="button"
            onClick={() => setName("")}
            disabled={loading}
            className="flex-1 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
