import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Form from "next/form";
import Link from "next/link";
import { selectAllJobPostings } from "@/db/queries/jobPostings";
import JobPostingSection from "@/app/[jobsiteId]/components/job-posting-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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

  const jobPostings = await selectAllJobPostings({
    userId: data!.user.id,
    jobTitle: jobTitle === undefined ? "" : jobTitle,
  });

  return (
    <main className="min-h-dvh px-4 pb-4">
      <div className="container mx-auto my-4 w-full overflow-y-auto rounded-xl p-2">
        <div className="flex justify-between gap-4">
          <h1 className="text-xl font-bold text-primary">Your Postings</h1>
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
      <JobPostingSection jobPostings={jobPostings} />
    </main>
  );
}
