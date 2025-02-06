import { JOB_BOARD_TITLES, type JobBoard } from "@/app/lib/constants";
import { notFound } from "next/navigation";
import type React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }

  return <div>{children}</div>;
}
