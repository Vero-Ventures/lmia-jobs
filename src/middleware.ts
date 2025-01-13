import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const domainName = req.headers.get("host") || "";

  if (domainName.includes("localhost")) {
    return NextResponse.next();
  }

  const validRoutes: Record<string, string[]> = {
    "ManageOpportunities.ca": [
      "/admin",
      "/admin/dashboard",
      "/coming-soon",
      "/opt-out",
      "/sign-up",
      "/log-in",
      "/reset-password",
    ],
    "AccessibleOpportunities.ca": ["/disability-job-board"],
    "AsylumOpportunities.ca": ["/asylum-job-board"],
    "IndigenousOpportunities.ca": ["/indigenous-job-board"],
    "ImmigrantOpportunities.ca": ["/newcomers-job-board"],
    "YouthOpportunities.ca": ["/youth-job-board"],
  };

  const pathname = req.nextUrl.pathname;

  if (validRoutes[domainName]) {
    if (!validRoutes[domainName].includes(pathname)) {
      const redirectPath = validRoutes[domainName][0];
      const url = new URL(redirectPath, req.nextUrl.origin);
      return NextResponse.redirect(url);
    }
  } else {
    return NextResponse.redirect(new URL("/404", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
