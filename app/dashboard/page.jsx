"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearch } from "@/lib/SearchContext";
import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";
import SearchBar from "@/components/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import { TrendingUp, BarChart3, Activity, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { searchQuery } = useSearch();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    categories: 0,
  });
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("today");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, categoriesRes] = await Promise.all([
          api.getNews().catch(() => []),
          api.getCategories().catch(() => []),
        ]);

        setNewsData(newsRes || []);
        setStats({
          totalNews: (newsRes || []).length,
          publishedNews: (newsRes || []).filter((n) => n.status === "published")
            .length,
          draftNews: (newsRes || []).filter((n) => n.status === "draft").length,
          categories: (categoriesRes || []).length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter news by search
  const filteredNews = useMemo(() => {
    if (!searchQuery) return newsData || [];
    return (newsData || []).filter(
      (n) =>
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [newsData, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const days = timeRange === "today" ? 1 : timeRange === "week" ? 7 : 30;
    const start = new Date(now);
    start.setDate(now.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const inRange = (ts) => ts && new Date(ts) >= start && new Date(ts) <= now;

    const newsInRange = filteredNews.filter(
      (n) => inRange(n.createdAt) || n.viewsHistory?.some(inRange),
    );

    const viewsCount = newsInRange.reduce((acc, n) => {
      if (Array.isArray(n.viewsHistory)) {
        acc += n.viewsHistory.filter(inRange).length;
      } else {
        acc += 1;
      }
      return acc;
    }, 0);

    const published = newsInRange.filter(
      (n) => n.status === "published",
    ).length;
    const draft = newsInRange.filter((n) => n.status === "draft").length;

    return {
      views: viewsCount.toLocaleString(),
      engagement: (published * 150).toLocaleString(),
      avgPerNews: newsInRange.length
        ? Math.round(viewsCount / newsInRange.length).toLocaleString()
        : "0",
      activeEditors: Math.max(1, Math.floor(published / 3)).toString(),
      totalInRange: newsInRange.length,
      publishedInRange: published,
      draftInRange: draft,
    };
  }, [filteredNews, timeRange]);

  const trendingNews = useMemo(() => {
    return [...(filteredNews || [])]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt),
      )
      .slice(0, 3);
  }, [filteredNews]);

  const handleNewsView = async (id) => {
    try {
      if (api.incrementNewsView) await api.incrementNewsView(id);
      toast.success("View recorded", { duration: 1500 });
    } catch (err) {
      toast.error("Failed to record view");
      console.error(err);
    }
  };

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-amber-100">
          Dashboard Overview
        </h1>
        <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-100 mb-2">
          Dashboard Overview
        </h1>
        <SearchBar />
        <Toaster position="top-right" />
      </div>

      {/* Time range filter */}
      <div className="mb-6 flex gap-2">
        {["today", "week", "month"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === range
                ? "bg-emerald-400 text-black shadow-lg"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Main stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-24 mb-4"></div>
              <div className="h-8 bg-slate-700 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total News (All Time)"
            value={stats.totalNews.toString()}
            subtext={`${stats.publishedNews} Published`}
            icon="📰"
            color="rose"
            onClick={() => router.push("/dashboard/news")}
          />
          <StatCard
            title={`Views (${timeRange})`}
            value={metrics.views}
            subtext={`Avg: ${metrics.avgPerNews} per news`}
            icon="👁️"
            color="cyan"
            trend="+0%"
            onClick={() => router.push("/dashboard/analytics")}
          />
          <StatCard
            title={`Engagement (${timeRange})`}
            value={metrics.engagement}
            subtext={`${metrics.draftInRange} Drafts pending`}
            icon="💬"
            color="purple"
            onClick={() => router.push("/dashboard/news")}
          />
          <StatCard
            title="Categories (All Time)"
            value={stats.categories.toString()}
            subtext="Organized content"
            icon="📁"
            color="green"
            onClick={() => router.push("/dashboard/categories")}
          />
        </div>
      )}

      {/* Trending news */}
      {trendingNews.length > 0 && (
        <div className="card">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              📰 Recent News
            </h2>
          </div>
          <div className="divide-y divide-slate-700">
            {trendingNews.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                onClick={() => handleNewsView(item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium group-hover:text-rose-300 transition-colors">
                      {item.title}
                    </h3>
                    {item.content && (
                      <p className="text-gray-400 text-sm mt-1 truncate">
                        {item.content.substring(0, 60)}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded ${item.status === "published" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredNews.length > 3 && (
            <div className="p-4 border-t border-slate-700 text-center">
              <a
                href="/dashboard/news"
                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm"
              >
                View all news →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {filteredNews.length === 0 && !loading && (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">📭 No news found</p>
          <p className="text-gray-500 text-sm mb-6">
            Try adjusting your search or create new news articles.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard/news/add"
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-all"
            >
              Create News
            </a>
            <a
              href="/dashboard/categories/add"
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
            >
              Create Category
            </a>
          </div>
        </div>
      )}
    </>
  );
}
