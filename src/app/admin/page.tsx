"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BaseLinks } from "@/app/admin/dashboard/lib/constants";

export default function Component() {
  const { data: session, isPending } = authClient.useSession();

  if (session && !isPending) {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <Navbar links={BaseLinks} />
      <div className="flex min-h-dvh flex-col">
        <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex items-center space-x-2">
            <span className="text-5xl font-bold tracking-tighter mb:text-6xl">
              Opportunities Dashboard
            </span>
          </div>
          <h1 className="mb-4 mt-6 text-xl font-bold tracking-tight mb:text-3xl">
            Easily Create And Manage Job Postings Across Multiple Boards
          </h1>
          <div className="mt-8 flex w-full flex-col gap-8 sm:flex-row">
            <Button
              asChild
              className="mt-4 w-full flex-1 py-8 text-2xl font-bold">
              <Link href={"/admin/sign-up"}>Join Now</Link>
            </Button>
            <Button
              asChild
              className="mt-4 w-full flex-1 py-8 text-2xl font-bold">
              <Link href={"/admin/sign-in"}>Log In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
