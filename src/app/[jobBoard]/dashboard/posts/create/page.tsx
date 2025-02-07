import { type JobBoard } from "@/app/lib/constants";
import { CreatePostForm } from "./create-post-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreatePostPage({
  params,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
}) {
  const { jobBoard } = await params;

  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }

  return (
    <CreatePostForm
      initialJobBoards={
        jobBoard === "all"
          ? ["accessible", "asylum", "indigenous", "newcomers", "youth"]
          : [jobBoard]
      }
    />
  );
}
