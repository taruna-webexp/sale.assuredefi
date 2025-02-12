import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { routesUrl } from "./utils/routeUrl";

export const ProtectedRoutes = [routesUrl.home];
export const UnprotectedRoutes = [
  routesUrl.login,
  routesUrl.signUp,
  routesUrl.forgot,
];

export async function middleware(request) {
  const token = cookies().get("accessToken")?.value || null;
  const pathname = request.nextUrl.pathname;

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
