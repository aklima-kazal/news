const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

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

export const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    // More precise network error detection
    if (error instanceof TypeError) {
      if (error.message.includes("Failed to fetch")) {
        throw new ApiError(
          `Cannot reach server at ${API_BASE_URL}. Make sure the backend is running.`,
          0,
        );
      }
      throw new ApiError("Network error. Please check your connection.", 0);
    }

    throw new ApiError(error.message || "Unexpected error occurred.", 0);
  }
};

export const api = {
  login: (email, password) =>
    request("/login", { method: "POST", body: { email, password } }),

  getNews: () => request("/news", { method: "GET" }),

  addNews: (news) => request("/news", { method: "POST", body: news }),

  deleteNews: (id) => request(`/news/${id}`, { method: "DELETE" }),
};
