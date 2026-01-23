import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = [
    "/cart",
    "/orders",
    "/restaurant-dashboard",
    "/admin",
  ];

  // Auth routes
  const authRoutes = ["/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(pathname);

  let user = null;

  // 🔐 backend auth check
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      user = data.user;
    }
  } catch (error) {
    user = null;
  }

  // ❌ Not logged in but protected route
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // ❌ Logged in user accessing login/register
  if (isAuthRoute && user) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  // 🔐 ADMIN only
  if (
    pathname.startsWith("/admin") &&
    user?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  // 🔐 RESTAURANT only
  if (
    pathname.startsWith("/restaurant-dashboard") &&
    user?.role !== "RESTAURANT"
  ) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  // 🔐 USER only
  if (
    (pathname.startsWith("/cart") ||
      pathname.startsWith("/orders")) &&
    user?.role !== "USER"
  ) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  return NextResponse.next();
}
