import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Form from "next/form";
import Link from "next/link";
import { selectUserJobPostings } from "@/db/queries/jobPostings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { JobListCard } from "@/app/[jobsiteId]/components/job-list-card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    jobTitle?: string;
    postId?: string;
  }>;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/admin");
  }

  const { jobTitle } = await searchParams;

  const jobPostings = await selectUserJobPostings({
    userId: data.user.id,
    jobTitle: jobTitle,
  });

  return (
    <main className="flex-1 px-4 pb-4">
      <div className="container mx-auto my-4 w-full rounded-xl p-2">
        <div className="flex justify-between gap-4">
          <h1 className="text-xl font-bold text-primary">
            Your Postings ({jobPostings.length})
          </h1>
          <Button asChild>
            <Link href={"/admin/dashboard/create-post"}>Create Post</Link>
          </Button>
        </div>
        <div className="space-y-4 pt-4 text-primary">
          <Form action={`/admin/dashboard`} className="flex gap-2">
            <Input
              name="jobTitle"
              placeholder="Search Jobs..."
              defaultValue={jobTitle}
            />
            <Button>Search</Button>
          </Form>
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
                  href={`/admin/dashboard/posts/${jobPosting.id}`}>
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
