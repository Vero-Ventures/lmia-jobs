import SingleJobPosting from "@/components/single-job-posting";

import { selectSingleJobPosting } from "@/db/queries/jobPostings";

interface PageProps {
  params: Promise<{ id: number }>;
}

export default async function SinglePostPage({ params }: PageProps) {
  const { id } = await params;

  const jobPosting = await selectSingleJobPosting(id);
  return <SingleJobPosting jobPosting={jobPosting} />;
}
