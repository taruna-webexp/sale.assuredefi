import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { routesUrl } from "./utils/routeUrl";

export const ProtectedRoutes = [routesUrl.home];
export const UnprotectedRoutes = [
  routesUrl.login,
  // routesUrl.signUp,
  routesUrl.forgot,
];

export async function middleware(request) {
  const assureDefiVerificationEmail = process.env.NEXT_PUBLIC_ADMINEMAIL;
  const userCookie = cookies().get("userDetail")?.value; // Get the raw cookie value
  let parsedUser = null;

  if (userCookie) {
    try {
      const decodedCookie = decodeURIComponent(userCookie); // Decode URL encoding
      parsedUser = JSON.parse(decodedCookie); // Parse JSON data
    } catch (error) {
      console.error("Error parsing userDetail cookie:", error);
    }
  }
  const token = cookies().get("accessToken")?.value || null;
  const pathname = request.nextUrl.pathname;

  // Admin the protected path
  const adminPath = routesUrl.registration;

  // Check if user is allowed
  if (
    request.nextUrl.pathname.startsWith(adminPath) &&
    parsedUser?.email !== assureDefiVerificationEmail
  ) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to home if not authorized
  }

  if (
    pathname.startsWith("/_next/") || // Next.js assets
    pathname.startsWith("/static/") || // Custom public assets
    pathname.startsWith("/api/") // API routes
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = ProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isUnprotectedRoute = UnprotectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user is NOT logged in, allow both login & signup pages
  if (!token && isUnprotectedRoute) {
    return NextResponse.next();
  }

  //  If user is logged in and tries to access login or signup, redirect to home
  if (isUnprotectedRoute && token) {
    return NextResponse.redirect(new URL(ProtectedRoutes[0], request.url));
  }

  //  If user is NOT logged in and tries to access a protected route, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(routesUrl.login, request.url));
  }

  return NextResponse.next();
}
