import { selectAllJobPostings } from "@/db/queries/jobPostings";
import Form from "next/form";
import FilterSelect from "./components/filter-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobListCard } from "./components/job-list-card";
import Link from "next/link";
import type { EmploymentType, JobBoard, Province } from "@/app/lib/constants";
import P from "@/components/paragraph";

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
  const { jobBoard } = await params;
  const search = await searchParams;
  const title = search.title ?? "";
  const province = search.province;
  const employmentType = search.employmentType;

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
          <P className="text-center">No jobs matched the filter.</P>
        )}
      </section>
    </div>
  );
}
