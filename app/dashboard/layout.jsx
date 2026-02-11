"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { SearchProvider } from "@/lib/SearchContext";

export default function DashboardLayout({ children }) {
  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-6 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SearchProvider>
  );
}
