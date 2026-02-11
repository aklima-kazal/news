"use client";

import Link from "next/link";
import { User, Lock, Bell, HelpCircle, ChevronRight } from "lucide-react";
import { useSearch } from "@/lib/SearchContext";

export default function SettingsPage() {
  const { searchQuery } = useSearch();

  const settingsSections = [
    {
      id: "profile",
      title: "Profile Settings",
      description: "Manage your account information and profile details",
      icon: User,
      color: "cyan",
      href: "/dashboard/settings/profile",
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Manage your password and authentication methods",
      icon: Lock,
      color: "amber",
      href: "/dashboard/settings/security",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Control what notifications you receive",
      icon: Bell,
      color: "pink",
      href: "#",
      disabled: true,
    },
    {
      id: "help",
      title: "Help & Support",
      description: "Find answers and get help with your account",
      icon: HelpCircle,
      color: "green",
      href: "#",
      disabled: true,
    },
  ];

  const filteredSections = searchQuery
    ? settingsSections.filter(
        (section) =>
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : settingsSections;

  const getColorClasses = (color) => {
    const colors = {
      cyan: "bg-cyan-900/20 border-cyan-700 text-cyan-400 hover:bg-cyan-900/30",
      amber:
        "bg-amber-900/20 border-amber-700 text-amber-400 hover:bg-amber-900/30",
      pink: "bg-pink-900/20 border-pink-700 text-pink-400 hover:bg-pink-900/30",
      green:
        "bg-green-900/20 border-green-700 text-green-400 hover:bg-green-900/30",
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">⚙️ Settings</h1>
        <p className="text-gray-400">
          Customize your preferences and account settings
        </p>
      </div>

      {searchQuery && (
        <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-700 text-cyan-300 rounded-lg">
          Search: <span className="font-semibold">"{searchQuery}"</span>
        </div>
      )}

      {filteredSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No settings found matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSections.map((section) => {
            const IconComponent = section.icon;
            const isDisabled = section.disabled;

            const content = (
              <div
                className={`card p-6 transition-all duration-200 ${
                  !isDisabled
                    ? "cursor-pointer hover:shadow-lg hover:shadow-slate-900/50 hover:border-slate-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg border ${getColorClasses(
                        section.color,
                      )}`}
                    >
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {section.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {section.description}
                      </p>
                      {isDisabled && (
                        <p className="text-gray-500 text-xs mt-2">
                          🔜 Coming soon
                        </p>
                      )}
                    </div>
                  </div>
                  {!isDisabled && (
                    <ChevronRight
                      size={20}
                      className="text-gray-500 group-hover:text-gray-300 shrink-0"
                    />
                  )}
                </div>
              </div>
            );

            return isDisabled ? (
              <div key={section.id}>{content}</div>
            ) : (
              <Link key={section.id} href={section.href} className="group">
                {content}
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <h3 className="text-white font-semibold mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>✓ Keep your profile information up to date</li>
          <li>✓ Use a strong password with mixed characters</li>
          <li>✓ Enable two-factor authentication for better security</li>
          <li>✓ Review your settings regularly</li>
        </ul>
      </div>
    </div>
  );
}
