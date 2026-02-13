import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

export function middleware(request) {
  const { cookies, url } = request;

  // Get token from cookies (or fallback to undefined)
  const token = cookies.get("token")?.value;

  // Check if the current path is protected
  const pathname = new URL(url).pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Not logged in → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request
  return NextResponse.next();
}

// Define which paths middleware runs on
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // add all protected routes here
};
