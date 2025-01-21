"use client";

import { useState } from "react";
import { JobListCard } from "./job-list-card";
import { JobPostingCard } from "./job-posting-card";
import { Loader2Icon } from "lucide-react";
import type { JobPosting } from "@/app/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function JobPostingSection({
  jobPostings,
}: {
  jobPostings: JobPosting[];
}) {
  const [selectedJobPosting, setSelectedJobPosting] = useState<JobPosting>(
    jobPostings[0]
  );

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChangeSelectedJobPosting = (jobPosting: JobPosting) => {
    setSelectedJobPosting(jobPosting);
    const params = new URLSearchParams(searchParams.toString());
    params.set("postId", String(jobPosting.id));
    router.push(pathname + "?" + params);
    return params.toString();
  };

  return (
    <section className="container mx-auto p-4">
      {jobPostings === undefined ? (
        <div className="flex items-center justify-center">
          <Loader2Icon className="size-20 animate-spin" />
        </div>
      ) : jobPostings.length > 0 ? (
        <div className="flex gap-4">
          <div className="mt-2 flex w-5/12 flex-col space-y-8 sm:w-4/12">
            <h1 className="absolute -translate-y-2 translate-x-2 text-xl font-semibold">
              Results: {jobPostings.length}
            </h1>
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
          <div className="sticky top-0 mx-1 max-h-dvh w-7/12 flex-1 overflow-hidden py-4 sm:w-8/12">
            <JobPostingCard jobPosting={selectedJobPosting} />
          </div>
        </div>
      ) : (
        <p className="mt-10 text-center">No jobs matched the filter.</p>
      )}
    </section>
  );
}
