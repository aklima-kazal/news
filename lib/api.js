// news/lib/api.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Custom error class for API responses
 */
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

/**
 * Retrieve JWT token from localStorage (if available)
 */
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/**
 * Handle fetch responses
 */
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new ApiError(data.error || "Invalid input.", 400);
      case 401:
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("auth");
        }
        throw new ApiError("Unauthorized. Please login again.", 401);
      case 404:
        throw new ApiError("Resource not found.", 404);
      default:
        if (response.status >= 500) {
          throw new ApiError(
            "Server error. Please try later.",
            response.status,
          );
        }
        throw new ApiError(
          data.error || "Unknown error occurred.",
          response.status,
        );
    }
  }

  return data;
};

/**
 * Generic request function
 */
export const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new ApiError(
        `Cannot reach server at ${API_BASE_URL}. Make sure the backend is running.`,
        0,
      );
    }

    throw new ApiError(error.message || "Unexpected error occurred.", 0);
  }
};

/**
 * API helper functions
 */
export const api = {
  // Auth
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  register: (user) => request("/auth/register", { method: "POST", body: user }),

  // News
  getNews: () => request("/news", { method: "GET" }),
  addNews: (news) => request("/news", { method: "POST", body: news }),
  updateNews: (id, news) =>
    request(`/news/${id}`, { method: "PUT", body: news }),
  deleteNews: (id) => request(`/news/${id}`, { method: "DELETE" }),

  // Categories
  getCategories: () => request("/categories", { method: "GET" }),
  addCategory: (category) =>
    request("/categories", { method: "POST", body: category }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),
  createCategory: (category) =>
    request("/categories", { method: "POST", body: category }), // optional alias
};
