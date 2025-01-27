import { selectAllJobPostings } from "@/db/queries/jobPostings";
import Form from "next/form";
import FilterSelect from "./components/filter-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FilterIcon } from "lucide-react";
import { JobListCard } from "./components/job-list-card";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ jobsiteId: string }>;
  searchParams: Promise<{
    jobTitle?: string;
    jobType?: string;
    location?: string;
    jobPostingId?: string;
  }>;
}) {
  const { jobsiteId } = await params;
  const search = await searchParams;
  const jobTitle = search.jobTitle ?? "";
  const location = search.location === "All" ? "" : (search.location ?? "");
  const jobType = search.jobType ? "" : (search.jobType ?? "");

  const jobPostings = await selectAllJobPostings({
    jobBoard: jobsiteId,
    jobTitle: jobTitle,
    location: location,
    jobType: jobType,
  });

  return (
    <main>
      <div className="container mx-auto space-y-4 pt-4 text-primary">
        <Form action={`/${jobsiteId}`} className="flex gap-2">
          <Input name="jobTitle" placeholder="Search Jobs..." />
          <Input
            type="hidden"
            value={jobType}
            name="jobType"
            disabled={jobType === "ALL" || jobType === undefined}
          />
          <Input
            type="hidden"
            value={location}
            name="location"
            disabled={location === "ALL" || location === undefined}
          />
          <Button>Search</Button>
        </Form>
        <div className="flex gap-2 font-semibold">
          <FilterIcon />
          <span>Filters</span>
        </div>
        <div className="flex gap-2 font-semibold">
          <FilterSelect initalValue={jobType} filterType="job type" />
          <FilterSelect initalValue={location} filterType="location" />
        </div>
      </div>
      <Separator className="mt-4" />
      <section className="container mx-auto p-4">
        {jobPostings.length > 0 ? (
          <div className="mt-2 space-y-8">
            {jobPostings.map((jobPosting) => {
              return (
                <Link
                  key={jobPosting.id}
                  href={`/${jobsiteId}/posts/${jobPosting.id}`}>
                  <JobListCard jobPosting={jobPosting} />
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-center">No jobs matched the filter.</p>
        )}
      </section>
    </main>
  );
}
