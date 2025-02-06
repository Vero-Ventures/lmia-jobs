import { JOB_BOARD_TITLES, type JobBoard } from "@/app/lib/constants";
import { notFound } from "next/navigation";
import type React from "react";
import Navbar from "@/components/navbar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
}) {
  const { jobBoard } = await params;
  const title = JOB_BOARD_TITLES[jobBoard];
  if (!title) {
    notFound();
  }
  return {
    title,
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
  children: React.ReactNode;
}) {
  const { jobBoard } = await params;
  const title = JOB_BOARD_TITLES[jobBoard];
  if (!title) {
    notFound();
  }
  return (
    <div className={jobBoard}>
      <header className="p-4">
        <Navbar title={title} />
      </header>
      {children}
    </div>
  );
}
