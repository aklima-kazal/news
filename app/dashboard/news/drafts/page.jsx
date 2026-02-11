"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const allNews = await api.getNews();
        setDrafts(allNews.filter((n) => n.status === "draft"));
      } catch (err) {
        toast.error("Failed to load drafts");
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  if (loading) return <div>⏳ Loading drafts...</div>;

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl mb-4">Drafts</h1>
      {drafts.length === 0 ? (
        <p>No drafts yet.</p>
      ) : (
        drafts.map((d) => (
          <div key={d.id} className="p-3 hover:bg-slate-800/30 mb-1 rounded">
            <h3 className="font-medium">{d.title}</h3>
            {d.category && (
              <span className="text-sm text-gray-400">{d.category}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
