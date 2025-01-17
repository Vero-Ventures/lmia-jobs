import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const domainName = req.headers.get("host") || "";

  const validRoutes: Record<string, string> = {
    "manageopportunities.ca": "/admin",
    "accessibleopportunities.ca": "/disability-job-board",
    "asylumopportunities.ca": "/asylum-job-board",
    "indigenousopportunities.ca": "/indigenous-job-board",
    "immigrantopportunities.ca": "/newcomers-job-board",
    "youthopportunities.ca": "/youth-job-board",
  };

  const targetPath = validRoutes[domainName];
  const baseRoute = req.nextUrl.pathname.split("/")[1];

  console.log("Domain: " + domainName);
  console.log("Target Path: " + targetPath);
  console.log("Base Route: " + baseRoute);
  console.log("Formatted Base Route: " + '/' + baseRoute)

  if (targetPath && ('/' + baseRoute) !== targetPath) {
    const url = new URL(validRoutes[domainName], req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
