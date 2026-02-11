// lib/auth.js

export async function loginUser(email, password) {
  // fake login example
  if (email === "a" && password === "b") {
    // save token (example)
    localStorage.setItem("token", "demo-token");

    return { success: true };
  }

  return { success: false, message: "Invalid credentials" };
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
