import { JOB_SITES } from "../lib/constants";
import { notFound } from "next/navigation";
import type React from "react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobsiteId: string }>;
}) {
  const { jobsiteId } = await params;
  const jobSite = JOB_SITES[+jobsiteId];
  return {
    title: jobSite?.title,
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ jobsiteId: string }>;
  children: React.ReactNode;
}) {
  const { jobsiteId } = await params;
  const jobSite = JOB_SITES[+jobsiteId];
  if (!jobSite) {
    notFound();
  }
  return (
    <div className={`jobsite-${jobsiteId}`}>
      <header className="p-4">
        <Link href={`/`}>
          <h1 className="text-xl font-bold text-primary">{jobSite.title}</h1>
        </Link>
      </header>
      {children}
    </div>
  );
}
