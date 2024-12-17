"use client";

import { JobListCard } from "./job-list-card";
import { useState } from "react";
import { JobPostingCard } from "./job-posting-card";
import { Loader2Icon } from "lucide-react";
import type { JobPosting } from "../lib/types";

export default function JobPostingSection({
  jobPostings,
}: {
  jobPostings: JobPosting[];
}) {
  const [selectedJobPosting, setSelectedJobPosting] = useState<JobPosting>(
    jobPostings[0]
  );

  const handleChangeSelectedJobPosting = (jobPosting: JobPosting) => {
    setSelectedJobPosting(jobPosting);
  };

  return (
    <section className="container mx-auto p-4">
      {jobPostings === undefined ? (
        <div className="flex items-center justify-center">
          <Loader2Icon className="size-20 animate-spin" />
        </div>
      ) : jobPostings.length > 0 ? (
        <div className="flex gap-4">
          <div className="w-4/12 space-y-8">
            {jobPostings.map((jobPosting) => {
              return (
                <JobListCard
                  isSelected={selectedJobPosting.id === jobPosting.id}
                  handleChangeSelectedJobPosting={
                    handleChangeSelectedJobPosting
                  }
                  key={jobPosting.id}
                  jobPosting={jobPosting}
                />
              );
            })}
          </div>
          <div className="sticky top-0 max-h-dvh w-8/12 flex-1 py-4">
            <JobPostingCard jobPosting={selectedJobPosting} />
          </div>
        </div>
      ) : (
        <div className="text-center">No jobs matched the filter.</div>
      )}
    </section>
  );
}
