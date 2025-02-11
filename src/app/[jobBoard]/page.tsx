import Form from "next/form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Paragraph from "@/components/ui/html/paragraph";
import FilterSelect from "@/app/[jobBoard]/components/filter-select";
import { JobListCard } from "@/app/[jobBoard]/components/job-list-card";
import { selectAllJobPostings } from "@/db/queries/jobPostings";
import type { EmploymentType, JobBoard, Province } from "@/app/lib/constants";

// Takes: Job Board in params, Optional title, province, and employmentType in searchParams.
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ jobBoard: JobBoard }>;
  searchParams: Promise<{
    title?: string;
    employmentType?: EmploymentType | "All";
    province?: Province | "All";
  }>;
}) {
  // Extract the jobBoard and search parameters from the URL.
  const { jobBoard } = await params;
  const search = await searchParams;
  const title = search.title ?? "";
  const province = search.province;
  const employmentType = search.employmentType;

  // Get all job postings for the job board that match the search parameters.
  const result = await selectAllJobPostings({
    jobBoard,
    title,
    province: province ?? "All",
    employmentType: employmentType ?? "All",
  });

  return (
    <div className="py-10">
      <div className="container mx-auto space-y-4 text-primary sm:w-4/5 md:w-2/3">
        <Form action={`/`} className="flex gap-4 sm:gap-6 md:gap-8">
          <Input name="jobTitle" placeholder="Search Jobs..." />
          <Input
            type="hidden"
            value={employmentType}
            name="employmentType"
            disabled={employmentType === "All" || employmentType === undefined}
          />
          <Input
            type="hidden"
            value={province}
            name="province"
            disabled={province === "All" || province === undefined}
          />
          <Button>Search</Button>
        </Form>
        <div className="!mt-6 flex justify-evenly gap-2 font-semibold">
          <FilterSelect
            initialValue={employmentType}
            filterType="employmentType"
          />

          <FilterSelect initialValue={province} filterType="province" />
        </div>
      </div>

      <section className="container mx-auto mt-4 p-4">
        <div className="ml-auto w-fit">
          <Link href={`/dashboard/posts/create`}>
            <Button className="mb-2 mr-6 !px-8 !py-6 text-xl font-bold">
              Create A Post
            </Button>
          </Link>
        </div>

        {result.length > 0 ? (
          <div className="space-y-8">
            {result.map(({ job_posting }) => {
              return (
                <Link key={job_posting.id} href={`/posts/${job_posting.id}`}>
                  <JobListCard jobPosting={job_posting} />
                </Link>
              );
            })}
          </div>
        ) : (
          <Paragraph className="text-center">
            No jobs matched the filter.
          </Paragraph>
        )}
      </section>
    </div>
  );
}
