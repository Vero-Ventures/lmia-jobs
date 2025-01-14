import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Form from "next/form";
import Link from "next/link";
import { selectAllJobPostings } from "@/db/queries/jobPostings";
import Navbar from "@/components/navbar";
import { Links } from "./lib/constants";
import Footer from "@/components/footer";
import JobPostingSection from "@/app/[jobsiteId]/components/job-posting-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin");
  }

  const { query } = await searchParams;

  const jobPostings = await selectAllJobPostings({
    query: query === undefined ? "" : query,
    email: session!.user.email,
  });

  return (
    <div>
      <Navbar links={Links} />
      <div className="flex min-h-[90dvh] flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <main className="flex flex-col px-4 pb-4 md:flex-row md:items-center">
          <div className="mx-2 my-4 max-h-[90dvh] w-full overflow-y-scroll rounded-xl border-2 bg-white p-2 mb:p-6 md:w-3/5 lg:mx-6 xl:w-2/3">
            <header className="border-b p-4">
              <h1 className="text-xl font-bold text-primary">Your Postings</h1>
            </header>
            <div className="container mx-auto space-y-4 pt-4 text-primary">
              <Form action={`/admin/dashboard`} className="flex gap-2">
                <Input
                  name="query"
                  placeholder="Search Jobs..."
                  defaultValue={query}
                />
                <Button>Search</Button>
              </Form>
            </div>
            <Separator className="mt-4" />
            <JobPostingSection jobPostings={jobPostings} />
          </div>
          <div className="mx-auto flex min-h-fit w-full flex-col justify-evenly justify-items-center p-2 md:w-2/5 lg:p-6 xl:w-1/3">
            <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-x-4 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 via-green-100 to-green-50 p-4 sm:grid-cols-4 sm:grid-rows-1 md:h-1/2 md:grid-cols-2 md:grid-rows-2">
              <div className="mb-2 mt-4 max-h-48 content-center">
                <h1 className="mx-auto my-4 w-max text-xl font-semibold lg:text-3xl">
                  Manage <br />
                  Postings
                </h1>
              </div>
              <div className="flex">
                <button className="mx-auto mt-2 flex max-h-40 min-h-36 w-full max-w-56 flex-col items-center justify-center rounded-xl border-4 border-green-200">
                  <Link href={"/admin/dashboard/create-post"}>
                    <p className="mx-auto my-4 w-max max-w-fit px-2 text-center text-lg font-semibold italic text-gray-700 lg:text-2xl">
                      Create A<br />
                      New Post
                    </p>
                  </Link>
                </button>
              </div>
              <div className="flex">
                <button className="mx-auto mt-2 flex max-h-40 min-h-36 w-full max-w-56 flex-col items-center justify-center rounded-xl border-4 border-green-200">
                  <Link href={"/admin/dashboard/create-post"}>
                    <p className="mx-auto my-4 w-max max-w-fit px-2 text-center text-lg font-semibold italic text-gray-700 lg:text-2xl">
                      Modify <br />
                      Selected Post
                    </p>
                  </Link>
                </button>
              </div>
              <div className="flex">
                <button className="mx-auto mt-2 flex max-h-40 min-h-36 w-full max-w-56 flex-col items-center justify-center rounded-xl border-4 border-green-200">
                  <Link href={"/admin/dashboard/create-post"}>
                    <p className="mx-auto my-4 w-max max-w-fit px-2 text-center text-lg font-semibold italic text-gray-800 lg:text-2xl">
                      Delete <br />
                      Selected Post
                    </p>
                  </Link>
                </button>
              </div>
            </div>
            <a
              href="https://stripe.com/en-ca"
              className="mt-4 max-h-40 items-center rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 via-green-100 to-green-50 p-4 py-6 md:mt-12 md:h-1/3">
              <h1 className="h=full w-full text-center text-2xl font-semibold lg:text-4xl">
                Manage Account
              </h1>
            </a>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
