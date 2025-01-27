import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { selectAllJobPostings } from "@/db/queries/jobPostings";
import Form from "next/form";
import JobPostingSection from "./components/job-posting-section";
import FilterSelect from "./components/filter-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FilterIcon } from "lucide-react";
import { JOB_SITES } from "../lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobsiteId: string }>;
}) {
  const { jobsiteId } = await params;
  const jobSite = JOB_SITES.find((jobSite) => jobSite.id === jobsiteId);
  return {
    title: jobSite?.title,
  };
}

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
  const { jobType, location, jobTitle } = await searchParams;

  const jobSite = JOB_SITES.find((jobSite) => jobSite.id === jobsiteId);

  if (!jobSite) {
    notFound();
  }

  const jobPostings = await selectAllJobPostings({
    jobBoard: jobSite.id,
    jobTitle: jobTitle === undefined ? "" : jobTitle,
    location: location === "All" ? "" : location,
    jobType: jobType === "All" ? "" : jobType,
  });

  return (
    <div className={cn("flex min-h-dvh flex-col", jobsiteId)}>
      <header className="border-b p-4">
        <h1 className="text-primary text-xl font-bold">{jobSite.title}</h1>
      </header>
      <main className="flex-1">
        <div className="text-primary container mx-auto space-y-4 pt-4">
          <Form action={`/${jobSite.id}`} className="flex gap-2">
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
        <JobPostingSection jobPostings={jobPostings} />
      </main>
    </div>
  );
}
