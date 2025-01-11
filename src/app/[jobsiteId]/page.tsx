import { notFound } from "next/navigation";
import Form from "next/form";
import JobPostingSection from "./components/job-posting-section";
import FilterSelect from "./components/filter-select";
import { cn } from "@/lib/utils";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { selectAllJobPostings } from "@/db/queries/jobPostings";

const JOB_SITES = [
  {
    id: "newcomers",
    title: "Newcomers Job Board",
  },
  {
    id: "youth",
    title: "Youth Job Board",
  },
  {
    id: "disabled",
    title: "Disabled Workers Job Board",
  },
  {
    id: "indigenous",
    title: "Indigenous Job Board",
  },
  {
    id: "asylum",
    title: "Asylum Refugees Job Board",
  },
];

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
    query?: string;
    jobType?: string;
    location?: string;
    jobPostingId?: string;
  }>;
}) {
  const { jobsiteId } = await params;
  const { jobType, location, query } = await searchParams;

  const jobSite = JOB_SITES.find((jobSite) => jobSite.id === jobsiteId);

  if (!jobSite) {
    notFound();
  }

  const jobPostings = await selectAllJobPostings({
    location: location === "All" ? "" : location,
    jobType: jobType === "All" ? "" : jobType,
    query: query === undefined ? "" : query,
    jobBoard: jobSite.id,
  });

  return (
    <div className={cn("flex min-h-dvh flex-col", jobsiteId)}>
      <header className="border-b p-4">
        <h1 className="text-xl font-bold text-primary">{jobSite.title}</h1>
      </header>
      <main className="flex-1">
        <div className="container mx-auto space-y-4 pt-4 text-primary">
          <Form action={`/${jobSite.id}`} className="flex gap-2">
            <Input name="query" placeholder="Search Jobs..." />
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
