import type { selectAllJobPostings } from "@/db/queries/jobPostings";

export type JobPosting = Awaited<
  ReturnType<typeof selectAllJobPostings>
>[number];
