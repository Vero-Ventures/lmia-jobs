import { JOB_BOARD_TITLES, type JobBoard } from "@/app/lib/constants";
import { notFound } from "next/navigation";
import type React from "react";
import Navbar from "@/components/page-wrappers/navbar";
import Footer from "@/components/page-wrappers/footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
}) {
  // Extract the jobBoard from the URL and generate a title for the page.
  const { jobBoard } = await params;
  const title = JOB_BOARD_TITLES[jobBoard];
  if (!title) {
    notFound();
  }
  return {
    title,
  };
}

// Takes: The job board in params and the child content as children.
export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
  children: React.ReactNode;
}) {
  // Extract the jobBoard from the URL and generate a title for the page.
  // If a title is not found, return a 404 page (used as domain management).
  const { jobBoard } = await params;
  const title = JOB_BOARD_TITLES[jobBoard];
  if (!title) {
    notFound();
  }
  return (
    <div className={`${jobBoard} flex flex-grow flex-col`}>
      <Navbar title={title} />
      <main className="my-auto flex flex-col justify-center">{children}</main>
      <Footer title={title} />
    </div>
  );
}
