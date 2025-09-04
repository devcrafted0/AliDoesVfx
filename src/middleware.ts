import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isVideosRoute = createRouteMatcher(["/videos(.*)", "/api/videos(.*)", "/contact(.*)" , "/api/contact(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

const ADMIN_USER_ID = "user_326Rv6xoB5tjaOgZeIuZzWYSzZf"; 

export default clerkMiddleware(async (auth, req) => {
  if (isVideosRoute(req)) {
    await auth.protect();
  }

  if (isDashboardRoute(req)) {
    const { userId } = await auth.protect();
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
