import { JobListCard } from "./job-list-card";
import type { JobPosting } from "@/app/lib/types";

export default function JobPostingSection({
  jobPostings,
}: {
  jobPostings: JobPosting[];
}) {
  return (
    <section className="container mx-auto p-4">
      {jobPostings.length > 0 ? (
        <div className="mt-2 space-y-8">
          {jobPostings.map((jobPosting) => {
            return <JobListCard key={jobPosting.id} jobPosting={jobPosting} />;
          })}
        </div>
      ) : (
        <p className="mt-10 text-center">No jobs matched the filter.</p>
      )}
    </section>
  );
}
