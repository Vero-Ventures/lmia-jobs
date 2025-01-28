import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") ?? "";

  // Extract the pathname from the requested URL (e.g., /about, /contact)
  const { pathname } = req.nextUrl;

  // Check if the request is coming from a local development environment
  const isLocal =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  const isPreview = hostname.includes("-yaniv-s-projects.vercel.app");

  let targetPath: string;

  if (isLocal || isPreview) {
    targetPath = `/${process.env.JOB_SITE}${pathname}`;
  } else {
    const validDomains: Record<string, string> = {
      "manageopportunities.ca": "admin",
      "accessibleopportunities.ca": "accessible",
      "asylumopportunities.ca": "asylum",
      "indigenousopportunities.ca": "indigenous",
      "immigrantopportunities.ca": "newcomers",
      "youthopportunities.ca": "youth",
    };

    targetPath = `${validDomains[hostname]}${pathname}`;
  }

  console.log({ targetPath });

  return NextResponse.rewrite(new URL(targetPath, req.url));
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)"],
};
