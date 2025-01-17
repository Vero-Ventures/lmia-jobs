import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const domainName = req.headers.get("host") || "";

  if (domainName.includes("localhost") || domainName.includes("127.0.0.1")) {
    return NextResponse.next();
  }

  const validRoutes: Record<string, string> = {
    "ManageOpportunities.ca": "/admin",
    "AccessibleOpportunities.ca": "/disability-job-board",
    "AsylumOpportunities.ca": "/asylum-job-board",
    "IndigenousOpportunities.ca": "/indigenous-job-board",
    "ImmigrantOpportunities.ca": "/newcomers-job-board",
    "YouthOpportunities.ca": "/youth-job-board",
  };

  const targetPath = validRoutes[domainName];
  const pathname = req.nextUrl.pathname;

  if (targetPath && (pathname === "/" || !pathname.startsWith(targetPath))) {
    const url = new URL(validRoutes[domainName], req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
