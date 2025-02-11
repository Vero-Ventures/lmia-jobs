import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SingleJobPosting from "@/components/single-job-posting";
import {
  selectUserSingleJobPosting,
  selectUserSingleJobPostingBoards,
} from "@/db/queries/jobPostings";

// Takes: A job post ID in the params.
export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }

  const { id } = await params;

  // Get the job posting and job boards for the job posting using the Id.
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
