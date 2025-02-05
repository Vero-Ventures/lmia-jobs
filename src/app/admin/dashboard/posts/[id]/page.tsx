import SingleJobPosting from "@/components/single-job-posting";
import {
  selectUserSingleJobPosting,
  selectUserSingleJobPostingBoards,
} from "@/db/queries/jobPostings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: number }>;
}

export default async function SinglePostPage({ params }: PageProps) {
  const { id } = await params;
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }
  const jobPosting = await selectUserSingleJobPosting({
    id,
    userId: data.user.id,
  });

  const jobPostingBoards = await selectUserSingleJobPostingBoards({
    id,
  });
  return (
    <SingleJobPosting
      isAdmin
      jobBoards={jobPostingBoards}
      isOwner={data.user.id === jobPosting.userId}
      jobPosting={jobPosting}
    />
  );
}
