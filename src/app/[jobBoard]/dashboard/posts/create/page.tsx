import { type JobBoard } from "@/app/lib/constants";
import { CreatePostForm } from "@/app/[jobBoard]/dashboard/posts/create/create-post-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Takes: The current job board inside the params.
export default async function CreatePostPage({
  params,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
}) {
  // Get the current job board from the URL.
  // Used in the form to set the initial job board.
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
