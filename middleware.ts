import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/exam"];
// const publicRoutes = ["/login", "/"];
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  // if (isProtectedRoute && !user) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }
  // if (req.nextUrl.pathname.startsWith("/login") && user) {
  //   return NextResponse.redirect(new URL("/", req.nextUrl));
  // }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
