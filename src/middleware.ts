import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const domainName = req.headers.get("host") || "";

  if (domainName.includes("localhost") || domainName.includes("127.0.0.1")) {
    return NextResponse.next();
  }

  const validRoutes: Record<string, string> = {
    "manageopportunities.ca": "/admin",
    "accessibleopportunities.ca": "/disability-job-board",
    "asylumopportunities.ca": "/asylum-job-board",
    "indigenousopportunities.ca": "/indigenous-job-board",
    "immigrantopportunities.ca": "/newcomers-job-board",
    "youthopportunities.ca": "/youth-job-board",
  };

  const targetPath = validRoutes[domainName];
  const pathname = req.nextUrl.pathname;

  console.log("Domain: " + domainName);
  console.log("Target Path: " + targetPath);
  console.log("Path Name: " + pathname);
  console.log("Inital Route: " + pathname.split("/")[1]);

  if (targetPath && pathname.split("/")[1] !== targetPath) {
    const url = new URL(validRoutes[domainName], req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
