import { selectUserSingleJobPosting } from "@/db/queries/jobPostings";
import { JobPostForm } from "../../job-post-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPost({ params }: PageProps) {
  const { id } = await params;
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/admin");
  }
  const jobPosting = await selectUserSingleJobPosting({
    id,
    userId: data.user.id,
  });
  return (
    <div>
      <JobPostForm mode="Edit" initialValues={jobPosting} />
    </div>
  );
}
