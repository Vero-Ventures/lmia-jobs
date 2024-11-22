"use client";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { JobListCard } from "./job-list-card";
import { useState } from "react";
import { JobPostingCard } from "./job-posting-card";
import { Loader2Icon } from "lucide-react";

export default function JobPostingSection({
  jobType,
  location,
}: {
  jobType?: string;
  location?: string;
}) {
  const jobPostings = useQuery(api.jobPostings.listJobPostings, {
    jobType,
    location,
  });

  const [selectedJobPosting, setSelectedJobPosting] =
    useState<Id<"jobPostings"> | null>(null);

  const handleChangeSelectedJobPosting = (jobPostingId: Id<"jobPostings">) => {
    setSelectedJobPosting(jobPostingId);
  };

  return (
    <section className="container mx-auto p-4">
      {jobPostings === undefined ? (
        <div className="flex items-center justify-center">
          <Loader2Icon className="size-20 animate-spin" />
        </div>
      ) : jobPostings === null ? (
        <div className="text-center">No jobs were found.</div>
      ) : (
        <div className="flex gap-4">
          <div className="w-4/12 space-y-8">
            {jobPostings.map((jobPosting) => {
              return (
                <JobListCard
                  isSelected={
                    selectedJobPosting
                      ? selectedJobPosting === jobPosting._id
                      : jobPostings[0]._id === jobPosting._id
                  }
                  handleChangeSelectedJobPosting={
                    handleChangeSelectedJobPosting
                  }
                  key={jobPosting._id}
                  jobPosting={jobPosting}
                />
              );
            })}
          </div>
          <div className="sticky top-0 max-h-dvh w-8/12 flex-1 py-4">
            <JobPostingCard
              jobPostingId={selectedJobPosting ?? jobPostings[0]._id}
            />
          </div>
        </div>
      )}
    </section>
  );
}
