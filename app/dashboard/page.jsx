"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearch } from "@/lib/SearchContext";
import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [timeRange, setTimeRange] = useState("today"); // today, week, month

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, categoriesRes] = await Promise.all([
          api.getNews(),
          api.getCategories(),
        ]);

        setNewsData(newsRes || []);
        setCategoriesData(categoriesRes || []);

        // Calculate global stats (not range-filtered)
        const totalNews = newsRes.length;
        const publishedNews = newsRes.filter(
          (n) => n.status === "published",
        ).length;
        const draftNews = newsRes.filter((n) => n.status === "draft").length;
        const totalCategories = categoriesRes.length;

        setStats({
          totalNews,
          publishedNews,
          draftNews,
          categories: totalCategories,
        });
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dynamic metrics for selected time range
  const metrics = useMemo(() => {
    const now = new Date();
    const days = timeRange === "today" ? 1 : timeRange === "week" ? 7 : 30;
    const start = new Date(now);
    start.setDate(now.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    // Helper: check if a timestamp is in range
    const inRange = (ts) => {
      if (!ts) return false;
      const d = new Date(ts);
      return d >= start && d <= now;
    };

    // Filter news created in range
    const createdInRange = newsData.filter(
      (n) =>
        inRange(n.createdAt) ||
        (Array.isArray(n.viewsHistory) && n.viewsHistory.some(inRange)),
    );

    const totalInRange = createdInRange.length;
    const publishedInRange = createdInRange.filter(
      (n) => n.status === "published",
    ).length;
    const draftInRange = createdInRange.filter(
      (n) => n.status === "draft",
    ).length;

    // Views: prefer counting viewsHistory entries in range, fallback to created count * 1
    let viewsCount = 0;
    createdInRange.forEach((n) => {
      if (Array.isArray(n.viewsHistory) && n.viewsHistory.length > 0) {
        viewsCount += n.viewsHistory.filter((ts) => inRange(ts)).length;
      } else {
        viewsCount += 1; // approximate
      }
    });

    const engagement = publishedInRange * 150;

    return {
      views: viewsCount.toLocaleString(),
      engagement: engagement.toLocaleString(),
      avgPerNews:
        totalInRange > 0
          ? Math.round(viewsCount / totalInRange).toLocaleString()
          : "0",
      activeEditors: Math.max(1, Math.floor(publishedInRange / 3)).toString(),
      totalInRange,
      publishedInRange,
      draftInRange,
    };
  }, [newsData, timeRange]);

  // Get recent/trending news
  const trendingNews = useMemo(() => {
    // prefer items with most recent views or createdAt
    const sorted = [...newsData].sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bDate - aDate;
    });
    return sorted.slice(0, 3);
  }, [newsData]);

  // Get growth percentage comparing current range to previous same length period
  const growthPercentage = useMemo(() => {
    const now = new Date();
    const days = timeRange === "today" ? 1 : timeRange === "week" ? 7 : 30;
    const start = new Date(now);
    start.setDate(now.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const prevEnd = new Date(start);
    prevEnd.setDate(start.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - (days - 1));

    const inPrevRange = (ts) => {
      if (!ts) return false;
      const d = new Date(ts);
      return d >= prevStart && d <= prevEnd;
    };

    const currentCount = newsData.filter(
      (n) =>
        (n.createdAt && new Date(n.createdAt) >= start) ||
        (Array.isArray(n.viewsHistory) &&
          n.viewsHistory.some((ts) => new Date(ts) >= start)),
    ).length;
    const prevCount = newsData.filter(
      (n) =>
        (n.createdAt && inPrevRange(n.createdAt)) ||
        (Array.isArray(n.viewsHistory) && n.viewsHistory.some(inPrevRange)),
    ).length;

    if (prevCount === 0) return currentCount === 0 ? "0%" : "+100%";
    const growth = ((currentCount - prevCount) / prevCount) * 100;
    return (growth >= 0 ? "+" : "") + growth.toFixed(1) + "%";
  }, [newsData, timeRange]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-100 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Welcome back! Here's what's happening on your dashboard.
        </p>
        <Toaster position="top-right" />
      </div>

      {searchQuery && (
        <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-700 text-cyan-300 rounded-lg">
          Search: <span className="font-semibold">"{searchQuery}"</span>
        </div>
      )}

      {/* Time Range Filter */}
      <div className="mb-6 flex gap-2">
        {["today", "week", "month"].map((range) => {
          const titleText =
            range === "today"
              ? "Show metrics for Today (24 hours)"
              : range === "week"
                ? "Show metrics for the last 7 days"
                : "Show metrics for the last 30 days";
          return (
            <button
              key={range}
              title={titleText}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                timeRange === range
                  ? "cursor-pointer bg-emerald-400 text-black shadow-lg shadow-emerald-500/30"
                  : "cursor-pointer bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Main Stats Grid */}
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
          <div title={`Metrics shown for the selected range (${timeRange})`}>
            <StatCard
              title="Total News"
              value={metrics.totalInRange?.toString() ?? "0"}
              subtext={`${metrics.publishedInRange ?? 0} Published`}
              icon="📰"
              color="rose"
              onClick={() => router.push("/dashboard/news")}
            />
          </div>
          <div title={`Views for the selected range (${timeRange})`}>
            <StatCard
              title="Views"
              value={metrics.views}
              subtext={`Avg: ${metrics.avgPerNews} per news`}
              icon="👁️"
              color="cyan"
              trend={growthPercentage}
              onClick={() => router.push("/dashboard/analytics")}
            />
          </div>
          <div title={`Engagement for the selected range (${timeRange})`}>
            <StatCard
              title="Engagement"
              value={metrics.engagement}
              subtext={`${metrics.draftInRange ?? 0} Drafts pending`}
              icon="💬"
              color="purple"
              onClick={() => router.push("/dashboard/news")}
            />
          </div>
          <div title={`Categories count (global)`}>
            <StatCard
              title="Categories"
              value={stats.categories.toString()}
              subtext="Organized content"
              icon="📁"
              color="green"
              onClick={() => router.push("/dashboard/categories")}
            />
          </div>
        </div>
      )}

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-medium">Active Editors</h3>
            <Activity className="text-cyan-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.activeEditors}
          </p>
          <p className="text-gray-400 text-sm mt-2">Currently active</p>
        </div>

        <div className="card p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-medium">Avg. Views/News</h3>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{metrics.avgPerNews}</p>
          <p className="text-gray-400 text-sm mt-2">Performance metric</p>
        </div>

        <div className="card p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-medium">Published Rate</h3>
            <BarChart3 className="text-amber-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {stats.totalNews > 0
              ? Math.round((stats.publishedNews / stats.totalNews) * 100)
              : 0}
            %
          </p>
          <p className="text-gray-400 text-sm mt-2">Of total news</p>
        </div>
      </div>

      {/* Recent News */}
      {trendingNews.length > 0 && (
        <div className="card">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span>📰</span> Recent News
            </h2>
          </div>
          <div className="divide-y divide-slate-700">
            {trendingNews.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                onClick={async () => {
                  try {
                    await api.incrementNewsView(item.id);
                    toast.success("View recorded", { duration: 1500 });
                  } catch (err) {
                    toast.error("Failed to record view");
                    console.error("View increment error", err);
                  }
                }}
                title="Click to record a view for this item"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className=" text-white font-medium group-hover:text-rose-300 transition-colors">
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
                      className={`text-xs font-semibold px-3 py-1 rounded ${
                        item.status === "published"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {newsData.length > 3 && (
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

      {/* Empty State */}
      {newsData.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">📭 No data yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Get started by creating your first news article or category
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
