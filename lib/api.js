// ./New folder/news/lib/api.js

// Custom error class
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Centralized response handler
const handle = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || "Error", res.status);
  }

  return data;
};

// Main API object
export const api = {
  // Auth APIs
  login: async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handle(res);
  },

  register: async (email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handle(res);
  },

  // News API
  getNews: async () => {
    const res = await fetch("/api/news");
    return handle(res);
  },

  // Categories API
  getCategories: async () => {
    const res = await fetch("/api/categories");
    return handle(res);
  },
};
