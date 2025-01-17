import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // const domainName = req.headers.get("host") || "";

  // const validRoutes: Record<string, string> = {
  //   "manageopportunities.ca": "/admin",
  //   "accessibleopportunities.ca": "/disability-job-board",
  //   "asylumopportunities.ca": "/asylum-job-board",
  //   "indigenousopportunities.ca": "/indigenous-job-board",
  //   "immigrantopportunities.ca": "/newcomers-job-board",
  //   "youthopportunities.ca": "/youth-job-board",
  // };

  // const targetPath = validRoutes[domainName];
  // const baseRoute = req.nextUrl.pathname.split("/")[1];
  // const formattedBaseRoute = `/${baseRoute}`;

  // if (targetPath && formattedBaseRoute !== targetPath) {
  //   const url = new URL(validRoutes[domainName], req.nextUrl.origin);
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
