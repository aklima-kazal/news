"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const defaultData = [
  { name: "Published", value: 75 },
  { name: "Draft", value: 25 },
];

const DEFAULT_COLORS = ["#38bdf8", "#22c55e", "#f97316", "#a855f7"];

export default function TrafficPieChart({ data = defaultData, colors = DEFAULT_COLORS, title = "Traffic / Status" }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl h-80 inset-shadow-sm inset-shadow-slate-500/30">
      <h3 className="mb-4 text-lg font-semibold text-amber-100">{title}</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
