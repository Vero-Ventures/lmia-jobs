"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";

type JobPosting = FunctionReturnType<
  typeof api.jobPostings.listJobPostings
>[number];

export default function JobPostingSection() {
  const jobPostings = useQuery(api.jobPostings.listJobPostings);

  return (
    <section className="max-h-[calc(100dvh-270px)] min-h-[calc(100dvh-270px)] overflow-y-auto p-4">
      <div>
        {!jobPostings ? (
          <div className="flex items-center justify-center">
            <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-gray-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {jobPostings.map((jobPosting) => {
              return (
                <JobListCard key={jobPosting._id} jobPosting={jobPosting} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function JobListCard({ jobPosting }: { jobPosting: JobPosting }) {
  return (
    <div className={`space-y-3 rounded-lg bg-white p-4 shadow-lg`}>
      <div>
        <h5 className={`titleCase text-xl font-bold dark:text-white`}>
          {jobPosting.jobTitle}
        </h5>
        <p className="pl-2 text-gray-500 dark:text-gray-400">
          {jobPosting.hiringOrganization}
        </p>
        <div className="flex justify-between pl-2">
          <div className="text-gray-500 dark:text-gray-400">
            {jobPosting.addressLocality}, {jobPosting.addressRegion}
          </div>
          <div className="mb-4 text-xs text-gray-400 dark:text-gray-300">
            {new Date(jobPosting.datePosted).toDateString()}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="pl-2 text-sm text-gray-500 dark:text-gray-400">
            ${`${jobPosting.minCompValue}`}{" "}
            {jobPosting.maxCompValue ? `to $${jobPosting.maxCompValue}` : ""}{" "}
            hourly
          </p>
          <button
            className={`titleCase hidden pl-3 text-sm font-bold dark:text-white sm:block`}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
