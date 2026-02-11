"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";

export default function SecuritySettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...passwordForm, [name]: value };
    setPasswordForm(newForm);

    if (name === "newPassword") {
      setPasswordStrength(calculateStrength(value));
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdatePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("❌ Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("❌ New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("❌ Password must be at least 8 characters long");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error("❌ New password must be different from current password");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));

      // Save new password (in real app, would be hashed and stored securely)
      localStorage.setItem("userPassword", passwordForm.newPassword);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(0);
      setIsChangingPassword(false);
      toast.success("✨ Password updated successfully!", { duration: 2000 });
    } catch (error) {
      toast.error("Failed to update password: " + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(
        `✨ Two-Factor Authentication ${!twoFactorEnabled ? "enabled" : "disabled"}!`,
        { duration: 2000 },
      );
    } catch (error) {
      toast.error("Failed to update 2FA setting");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-600";
    if (strength <= 2) return "bg-orange-600";
    if (strength <= 3) return "bg-yellow-600";
    if (strength <= 4) return "bg-lime-600";
    return "bg-green-600";
  };

  const getStrengthText = (strength) => {
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    if (strength <= 4) return "Strong";
    return "Very Strong";
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full sm:max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            🔒 Security Settings
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your password, authentication, and security preferences
          </p>
        </div>

        {/* Change Password Card */}
        <div className="card mb-6 space-y-6">
          <div className="flex items-start sm:items-center gap-3 pb-4 border-b border-slate-700">
            <Lock className="text-cyan-400 shrink-0" size={24} />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Change Password
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Update your account password regularly
              </p>
            </div>
          </div>

          {!isChangingPassword ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 shrink-0" size={20} />
                <span className="text-green-300 text-sm sm:text-base">Password is secure</span>
              </div>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all text-sm"
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  <Lock size={16} />
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="w-full px-3 py-2.5 sm:py-2 pr-10 bg-slate-700 text-white rounded-lg border border-slate-600 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-base sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePasswordVisibility("current")}
                    className="absolute right-3 top-3 sm:top-2.5 text-gray-400 hover:text-white shrink-0"
                  >
                    {showPasswords.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  <Lock size={16} />
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    className="w-full px-3 py-2.5 sm:py-2 pr-10 bg-slate-700 text-white rounded-lg border border-slate-600 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-base sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePasswordVisibility("new")}
                    className="absolute right-3 top-3 sm:top-2.5 text-gray-400 hover:text-white shrink-0"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordForm.newPassword && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded ${
                            i < passwordStrength
                              ? getStrengthColor(passwordStrength)
                              : "bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Strength:{" "}
                      <span className="font-semibold">
                        {getStrengthText(passwordStrength)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                  <Lock size={16} />
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    className="w-full px-3 py-2.5 sm:py-2 pr-10 bg-slate-700 text-white rounded-lg border border-slate-600 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-base sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePasswordVisibility("confirm")}
                    className="absolute right-3 top-3 sm:top-2.5 text-gray-400 hover:text-white shrink-0"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {passwordForm.confirmPassword &&
                  passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleUpdatePassword}
                  disabled={isLoading}
                  className="flex-1 px-6 py-2.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Updating...
                    </>
                  ) : (
                    <>✓ Update Password</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPasswordStrength(0);
                  }}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-6 py-2.5 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="card mb-6 space-y-4">
          <div className="flex items-start sm:items-center justify-between pb-4 border-b border-slate-700 gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <Shield className="text-amber-400 shrink-0" size={24} />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Two-Factor Authentication
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Add an extra layer of security
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-4 bg-slate-700/30 rounded-lg">
            <div className="flex-1">
              <p className="text-white font-medium">
                {twoFactorEnabled ? "✓ Enabled" : "Disabled"}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                {twoFactorEnabled
                  ? "Receive codes on your registered device"
                  : "Get additional security with 2FA"}
              </p>
            </div>
            <button
              onClick={handleToggle2FA}
              disabled={isLoading}
              className={`relative inline-flex shrink-0 h-8 w-14 items-center rounded-full transition-all ${
                twoFactorEnabled ? "bg-green-600" : "bg-slate-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all ${
                  twoFactorEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {twoFactorEnabled && (
            <div className="p-3 sm:p-4 bg-green-900/20 border border-green-700 rounded-lg text-xs sm:text-sm text-green-300 flex items-start gap-3">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              <span>
                2FA is now active on your account. You'll need to enter a code
                when logging in.
              </span>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-cyan-400 shrink-0 mt-1" size={18} />
            <div className="text-xs sm:text-sm text-gray-400">
              <p className="font-semibold text-white mb-2">🔐 Security Tips:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Use a strong password with uppercase, lowercase, and numbers
                </li>
                <li>Never share your password with anyone</li>
                <li>Enable two-factor authentication for added security</li>
                <li>
                  Change your password regularly (every 90 days recommended)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
