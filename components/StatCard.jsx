"use client";

import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtext = "",
  icon = "📊",
  color = "rose",
  trend = null,
  onClick = null,
}) {
  const colorClasses = {
    rose: "bg-rose-900/20 border-rose-700 text-rose-400 shadow-rose-500/10",
    cyan: "bg-cyan-900/20 border-cyan-700 text-cyan-400 shadow-cyan-500/10",
    purple: "bg-purple-900/20 border-purple-700 text-purple-400 shadow-purple-500/10",
    green: "bg-green-900/20 border-green-700 text-green-400 shadow-green-500/10",
    amber: "bg-amber-900/20 border-amber-700 text-amber-400 shadow-amber-500/10",
  };

  const selectedColor = colorClasses[color] || colorClasses.rose;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === "Enter" || e.key === " ") && onClick()}
      className={`card border-l-4 ${selectedColor} p-6 h-full transition-all ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <TrendingUp size={16} />
              {trend}
            </div>
          )}
        </div>

        {subtext && (
          <p className="text-gray-400 text-xs">{subtext}</p>
        )}
      </div>
    </div>
  );
}
