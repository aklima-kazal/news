"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiPhpmyadmin } from "react-icons/si";
import { MdOutlineDashboard } from "react-icons/md";
import { IoMdAnalytics } from "react-icons/io";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    icon: <MdOutlineDashboard size={24} />,
    href: "/dashboard",
  },
  {
    label: "Analytics",
    icon: <IoMdAnalytics size={20} />,
    href: "/dashboard/analytics",
  },
  {
    label: "News",
    icon: <IoNewspaperOutline size={24} />,
    children: [
      { label: "All News", href: "/dashboard/news" },
      { label: "Add News", href: "/dashboard/news/add" },
      { label: "Drafts", href: "/dashboard/news/drafts" },
    ],
  },
  {
    label: "Categories",
    icon: <MdOutlineCategory size={24} />,
    children: [
      { label: "All Categories", href: "/dashboard/categories" },
      { label: "Add Category", href: "/dashboard/categories/add" },
    ],
  },
  {
    label: "Settings",
    icon: <FiSettings size={22} />,
    children: [
      { label: "Profile", href: "/dashboard/settings/profile" },
      { label: "Security", href: "/dashboard/settings/security" },
    ],
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose = () => {},
  collapsed = false,
  onCollapsedChange = () => {},
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  // Open parent menu if current pathname matches one of its children
  useEffect(() => {
    for (const item of menu) {
      if (item.children) {
        const match = item.children.some(
          (c) => pathname === c.href || pathname.startsWith(c.href),
        );
        if (match) {
          setOpenMenu(item.label);
          return;
        }
      }
      if (item.href && pathname === item.href) {
        setOpenMenu(null);
        return;
      }
    }
  }, [pathname]);

  const isItemActive = (item) => {
    if (item.href) return pathname === item.href;
    if (item.children)
      return item.children.some(
        (c) => pathname === c.href || pathname.startsWith(c.href),
      );
    return false;
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden={!mobileOpen}
      />

      <div
        className={`z-50 transform top-0 left-0 ${collapsed ? "w-16" : "w-64"} sidebar-transition bg-darkbg border-r border-borderdark p-4 fixed h-full lg:relative lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto lg:block`}
      >
        <div className="mb-8 mt-2 flex gap-x-2 shadow-blue-100 shadow-lg/20 items-center rounded-md">
          <SiPhpmyadmin size={40} className="text-green-300 shrink-0" />
          {!collapsed && (
            <h1 className="text-xl font-semibold text-white font-sans whitespace-nowrap">
              News Admin board
            </h1>
          )}
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
            className="ml-auto hidden lg:flex items-center justify-center p-1 rounded hover:bg-slate-700 shrink-0"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="space-y-2">
          {menu.map((item) => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  title={collapsed ? item.label : ""}
                  className={`flex items-center gap-2 text-lg font-medium px-3 py-2 rounded transition-colors ${isItemActive(item) ? "bg-violet-300 text-black" : "text-blue-300 hover:bg-slate-700 hover:text-white"}`}
                  aria-current={isItemActive(item) ? "page" : undefined}
                >
                  {item.icon} {!collapsed && item.label}
                </Link>
              ) : (
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === item.label ? null : item.label)
                  }
                  title={collapsed ? item.label : ""}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded transition-colors ${isItemActive(item) ? "bg-violet-300 text-black" : "text-blue-300 hover:bg-slate-700 hover:text-white"}`}
                >
                  <span
                    className={`flex items-center gap-x-2 cursor-pointer font-medium text-lg`}
                  >
                    {item.icon} {!collapsed && item.label}
                  </span>
                  {!collapsed && (
                    <span className="flex items-center gap-x-2">
                      {openMenu === item.label ? (
                        <BsCaretUp />
                      ) : (
                        <BsCaretDown />
                      )}
                    </span>
                  )}
                </button>
              )}

              {/* Submenu */}
              {item.children && openMenu === item.label && !collapsed && (
                <div className="ml-6 mt-1 space-y-1 animate-slide-down">
                  {item.children.map((sub) => {
                    const subActive =
                      pathname === sub.href || pathname.startsWith(sub.href);
                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${subActive ? "bg-slate-700 text-white" : "text-emerald-100 hover:text-white hover:bg-gray-800"}`}
                        aria-current={subActive ? "page" : undefined}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
