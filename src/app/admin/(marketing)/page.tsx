import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (data) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-grow flex-col justify-center px-4 text-center">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter md:text-5xl">
        Effortlessly Create and Manage Job Postings Across Multiple Job Boards
      </h1>
      <Button asChild className="mt-4 py-8 text-2xl font-bold">
        <Link href={"/sign-in"}>Get Started For Free</Link>
      </Button>
    </main>
  );
}
