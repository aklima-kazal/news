"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, Clock, AlertCircle } from "lucide-react";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Editor",
    joinedDate: new Date().toLocaleDateString(),
  });

  const [originalData, setOriginalData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load user data on mount
  useEffect(() => {
    // Simulate loading from localStorage or API
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedName = localStorage.getItem("userName") || "Admin User";

    const userData = {
      name: storedName,
      email: storedEmail,
      role: "Editor",
      joinedDate: new Date().toLocaleDateString(),
    };

    setFormData(userData);
    setOriginalData(userData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("❌ Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("❌ Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 800));

      // Save to localStorage
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userEmail", formData.email);

      setOriginalData(formData);
      setHasChanges(false);
      setIsEditing(false);
      toast.success("✨ Profile updated successfully!", { duration: 2000 });
    } catch (error) {
      toast.error("Failed to save profile: " + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setHasChanges(false);
    setIsEditing(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full sm:max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            👤 Profile Settings
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your account information and profile details
          </p>
        </div>

        {/* Profile Card */}
        <div className="card space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-700">
            <div className="w-16 h-16 shrink-0 bg-linear-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{formData.name}</p>
              <p className="text-gray-400 text-sm truncate">{formData.email}</p>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <User size={16} />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
                className="w-full px-3 py-2.5 sm:py-2 bg-slate-700 text-white rounded-lg border border-slate-600 outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <Mail size={16} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your email"
                className="w-full px-3 py-2.5 sm:py-2 bg-slate-700 text-white rounded-lg border border-slate-600 outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-sm"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full px-3 py-2.5 sm:py-2 bg-slate-700 text-gray-300 rounded-lg border border-slate-600 opacity-60 cursor-not-allowed text-base sm:text-sm"
              />
            </div>

            {/* Joined Date (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <Clock size={16} />
                Joined
              </label>
              <input
                type="text"
                value={formData.joinedDate}
                disabled
                className="w-full px-3 py-2.5 sm:py-2 bg-slate-700 text-gray-300 rounded-lg border border-slate-600 opacity-60 cursor-not-allowed text-base sm:text-sm"
              />
            </div>
          </div>

          {/* Info Message */}
          {!isEditing && (
            <div className="flex items-center gap-3 p-3 bg-cyan-900/20 border border-cyan-700 text-cyan-300 rounded-lg text-xs sm:text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>
                Click "Edit Profile" to make changes to your account
                information.
              </span>
            </div>
          )}

          {isEditing && hasChanges && (
            <div className="flex items-center gap-3 p-3 bg-amber-900/20 border border-amber-700 text-amber-300 rounded-lg text-xs sm:text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>You have unsaved changes.</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 text-base sm:text-sm"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading || !hasChanges}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Saving...
                    </>
                  ) : (
                    <>✓ Save Changes</>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                >
                  ✕ Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 sm:mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-gray-400 text-xs sm:text-sm">
            <span className="font-semibold">💡 Tip:</span> Keep your profile
            information up to date. Your email is used for notifications and
            account recovery.
          </p>
        </div>
      </div>
    </>
  );
}
