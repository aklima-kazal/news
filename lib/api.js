// lib/api.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

// Only access localStorage client-side
const getToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

// Handle fetch responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
    }
    throw new ApiError(data.error || "Unknown error", response.status);
  }

  return data;
};

// Generic request
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions = { ...options, headers };

  if (options.body && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    return await handleResponse(res);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Network error", 0);
  }
};

// Safe API wrapper
export const api = {
  // Auth
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  register: (user) => request("/auth/register", { method: "POST", body: user }),

  // News
  getNews: () => request("/news"),
  createNews: (title, content, category = null, status = "draft") =>
    request("/news", {
      method: "POST",
      body: { title, content, category, status },
    }),
  updateNews: (id, news) =>
    request(`/news/${id}`, { method: "PUT", body: news }),
  deleteNews: (id) => request(`/news/${id}`, { method: "DELETE" }),
  incrementNewsView: (id) => request(`/news/${id}/view`, { method: "POST" }),

  // Categories
  getCategories: () => request("/categories"),
  addCategory: (name) =>
    request("/categories", { method: "POST", body: { name } }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),
};
