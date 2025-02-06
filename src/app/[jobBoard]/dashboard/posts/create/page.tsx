import { type JobBoard } from "@/app/lib/constants";
import { CreatePostForm } from "./create-post-form";

export default async function CreatePostPage({
  params,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
}) {
  const { jobBoard } = await params;

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
