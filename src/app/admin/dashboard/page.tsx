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
import { createStripeUser } from "@/actions/stripe/create-user";
import { checkUserPurchases } from "@/actions/stripe/check-purchases";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    jobTitle?: string;
    postId?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin");
  } else {
    await createStripeUser(session.user.email);
    const result = await checkUserPurchases(session.user.email);
    if (result === "refresh") {
      redirect("/admin/dashboard");
    }
  }

  const { jobTitle } = await searchParams;

  const jobPostings = await selectAllJobPostings({
    email: session!.user.email,
    jobTitle: jobTitle === undefined ? "" : jobTitle,
  });

  return (
    <main className="flex flex-col px-4 pb-4 md:flex-row">
      <div className="mx-2 my-4 w-full overflow-y-auto rounded-xl bg-white p-2 mb:p-6 lg:mx-6">
        <div className="flex justify-between gap-4">
          <h1 className="text-xl font-bold text-primary">Your Postings</h1>
          <Button asChild>
            <Link href={"/admin/dashboard/create-post"}>Create Post</Link>
          </Button>
        </div>
        <div className="container mx-auto space-y-4 pt-4 text-primary">
          <Form action={`/admin/dashboard`} className="flex gap-2">
            <Input
              name="jobTitle"
              placeholder="Search Jobs..."
              defaultValue={jobTitle}
            />
            <Button>Search</Button>
          </Form>
        </div>
        <Separator className="mt-4" />
        <JobPostingSection jobPostings={jobPostings} />
      </div>
    </main>
  );
}
