"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api"; // use the api.js we fixed

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.login(email, password);

      // Assuming backend returns a token and user info
      if (result?.token) {
        // Save auth to localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("auth", JSON.stringify(result.user));

        toast.success("Login Successful!");

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        toast.error(result?.message || "Login failed.");
      }
    } catch (err) {
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
