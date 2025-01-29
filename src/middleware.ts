import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JOB_BOARD_DOMAINS } from "./app/lib/constants";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") ?? "";

  // Extract the pathname from the requested URL (e.g., /about, /contact)
  const { pathname, search } = req.nextUrl;

  // Check if the request is coming from a local development environment
  const isLocal =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  const isPreview = hostname.includes("-yaniv-s-projects.vercel.app");

  const targetPath = `/${isLocal || isPreview ? process.env.JOB_SITE : JOB_BOARD_DOMAINS[hostname]}${pathname}${search}`;

  return NextResponse.rewrite(new URL(targetPath, req.url));
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)"],
};
