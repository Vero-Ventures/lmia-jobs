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
    title?: string;
    employmentType?: string;
    province?: string;
  }>;
}) {
  const { jobsiteId } = await params;
  const search = await searchParams;
  const title = search.title ?? "";
  const province = search.province ?? "All";
  const employmentType = search.employmentType ?? "All";

  const result = await selectAllJobPostings({
    jobBoardId: +jobsiteId,
    title,
    province,
    employmentType,
  });

  return (
    <main>
      <div className="container mx-auto space-y-4 pt-4 text-primary">
        <Form action={`/`} className="flex gap-2">
          <Input name="jobTitle" placeholder="Search Jobs..." />
          <Input
            type="hidden"
            value={employmentType}
            name="employmentType"
            disabled={employmentType === "ALL" || employmentType === undefined}
          />
          <Input
            type="hidden"
            value={province}
            name="province"
            disabled={province === "ALL" || province === undefined}
          />
          <Button>Search</Button>
        </Form>
        <div className="flex gap-2 font-semibold">
          <FilterIcon />
          <span>Filters</span>
        </div>
        <div className="flex gap-2 font-semibold">
          <FilterSelect
            initalValue={employmentType}
            filterType="employmentType"
          />
          <FilterSelect initalValue={province} filterType="province" />
        </div>
      </div>
      <Separator className="mt-4" />
      <section className="container mx-auto p-4">
        {result.length > 0 ? (
          <div className="mt-2 space-y-8">
            {result.map(({ job_posting }) => {
              return (
                <Link key={job_posting.id} href={`/posts/${job_posting.id}`}>
                  <JobListCard jobPosting={job_posting} />
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
