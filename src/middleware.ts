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
  const pathName = req.nextUrl.pathname;

  console.log('Target Path: ' + targetPath)
  console.log('Base Route: ' + pathName)

  // if (targetPath && formattedBaseRoute !== targetPath) {
  //   const url = new URL(validRoutes[domainName], req.nextUrl.origin);
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
