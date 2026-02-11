"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const defaultData = [
  { category: "Politics", news: 40 },
  { category: "Sports", news: 68 },
  { category: "Tech", news: 55 },
  { category: "Health", news: 32 },
  { category: "Entertainment", news: 48 },
];

export default function CategoryBarChart({ data = defaultData, title = "News by Category" }) {
  return (
    <div className="bg-slate-800 p-8 font-normal text-lg rounded-xl h-80 inset-shadow-sm inset-shadow-slate-500/30">
      <h3 className="mb-4 text-amber-100 font-semibold">{title}</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="category" stroke="#cbd5f5" />
          <YAxis stroke="#cbd5f5" />
          <Tooltip />
          <Bar dataKey="news" fill="#137e91" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
