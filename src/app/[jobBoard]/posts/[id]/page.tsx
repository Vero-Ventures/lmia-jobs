import { selectSingleJobPosting } from "@/db/queries/jobPostings";
import SingleJobPosting from "@/components/single-job-posting";

// Takes: The post Id in the params.
export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  // Get the post Id from the paramaters.
  const { id } = await params;

  // Fetch the job posting from the database for the Single Job Posting component.
  const jobPosting = await selectSingleJobPosting(id);

  return <SingleJobPosting jobPosting={jobPosting} />;
}
