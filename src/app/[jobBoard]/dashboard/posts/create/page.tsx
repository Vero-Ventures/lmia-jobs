import type { JobBoard } from "@/app/lib/constants";
import { CreatePostForm } from "./create-post-form";

export default async function CreatePostPage(
  params: Promise<{ jobBoard: JobBoard }>
) {
  const { jobBoard } = await params;
  return <CreatePostForm initialJobBoard={jobBoard} />;
}
