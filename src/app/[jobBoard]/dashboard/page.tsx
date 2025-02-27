import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Form from "next/form";
import Link from "next/link";
import { selectUserJobPostings } from "@/db/queries/jobPostings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobListCard } from "@/app/[jobBoard]/components/job-list-card";
import Paragraph from "@/components/ui/html/paragraph";

// Tales: The search params containing an option title and post Id in the params.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    title?: string;
    postId?: string;
  }>;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }

  // Check for a title paramater to use in getting the user's job postings.
  const { title } = await searchParams;

  const jobPostings = await selectUserJobPostings({
    userId: data.user.id,
    title,
  });

  return (
    <main className="flex-1 px-4 pb-4">
      <div className="container mx-auto mt-4 w-full rounded-xl p-2 sm:w-4/5 md:w-3/4">
        <div className="flex justify-between gap-4 sm:px-6">
          <h1 className="text-xl font-bold text-primary sm:mt-2 md:text-2xl">
            Your Postings ({jobPostings.length})
          </h1>
          <Button asChild>
            <Link
              className="!text-lg sm:!p-6 sm:text-lg"
              href={"/dashboard/posts/create"}>
              Create Post
            </Link>
          </Button>
        </div>
        <div className="mt-2 space-y-4 pt-4 text-primary">
          <Form action={`/`} className="flex gap-4 sm:gap-6">
            <Input
              name="jobTitle"
              placeholder="Search Jobs..."
              defaultValue={title}
            />
            <Button className="!text-lg sm:!px-6">Search</Button>
          </Form>
        </div>
      </div>
      <section className="container mx-auto p-4">
        {jobPostings.length > 0 ? (
          <div className="space-y-8">
            {jobPostings.map((jobPosting) => {
              return (
                <Link
                  key={jobPosting.id}
                  href={`/dashboard/posts/${jobPosting.id}`}>
                  <JobListCard jobPosting={jobPosting} isAdmin />
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
    </main>
  );
}
