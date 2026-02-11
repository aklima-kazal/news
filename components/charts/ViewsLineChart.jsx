"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const defaultData = [
  { day: "Mon", views: 1200 },
  { day: "Tue", views: 2100 },
  { day: "Wed", views: 1800 },
  { day: "Thu", views: 2600 },
  { day: "Fri", views: 3200 },
  { day: "Sat", views: 2900 },
  { day: "Sun", views: 3500 },
];

export default function ViewsLineChart({ data = defaultData, title = "Daily Views" }) {
  return (
    <div className="bg-slate-800 p-8 rounded-xl h-80  inset-shadow-sm inset-shadow-slate-500/30">
      <h3 className="mb-4 font-semibold text-lg text-amber-100">{title}</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="day" stroke="#cbd5f5" />
          <YAxis stroke="#cbd5f5" />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#38bdf8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
