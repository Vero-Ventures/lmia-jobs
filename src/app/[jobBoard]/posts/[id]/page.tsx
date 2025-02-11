import { selectSingleJobPosting } from "@/db/queries/jobPostings";
import SingleJobPosting from "@/components/single-job-posting";

interface PageProps {
  params: Promise<{ id: number }>;
}

// Takes: The post Id in the params.
export default async function SinglePostPage({ params }: PageProps) {
  // Get the post Id from the paramaters.
  const { id } = await params;

  // Fetch the job posting from the database for the Single Job Posting component.
  const jobPosting = await selectSingleJobPosting(id);

  return <SingleJobPosting jobPosting={jobPosting} />;
}
