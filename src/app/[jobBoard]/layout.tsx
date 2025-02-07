import { JOB_BOARD_TITLES, type JobBoard } from "@/app/lib/constants";
import { notFound } from "next/navigation";
import type React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
    <div className={`${jobBoard} flex flex-grow flex-col`}>
      <Navbar title={title} />
      <main className="my-auto flex flex-col justify-center">{children}</main>
      <Footer title={title} />
    </div>
  );
}
