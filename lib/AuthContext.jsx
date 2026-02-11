"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth");
    const token = localStorage.getItem("token");
    if (savedUser && token) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.user);
    localStorage.setItem("auth", JSON.stringify(res.user));
    localStorage.setItem("token", res.token);
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
