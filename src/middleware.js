import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = [
    // "/cart", // Removed - cart handles its own auth
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
    console.log("🔍 Middleware: Checking auth for:", pathname);
    console.log("� API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("�🍪 Cookies:", req.headers.get("cookie"));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        method: 'GET',
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
        credentials: 'include', // Important for cookies
        cache: 'no-store', // Prevent caching
      }
    );

    console.log("📡 Auth API Response Status:", res.status);

    if (res.ok) {
      const data = await res.json();
      user = data.user;
      console.log("✅ User authenticated:", user?.email, "Role:", user?.role);
    } else {
      console.log("❌ Auth failed - Response not OK");
    }
  } catch (error) {
    console.error("🚨 Middleware auth error:", error.message);
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

  // 🔐 USER only (orders)
  if (
    pathname.startsWith("/orders") &&
    user?.role !== "USER"
  ) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  return NextResponse.next();
}
