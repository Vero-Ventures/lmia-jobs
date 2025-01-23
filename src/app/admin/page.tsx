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
      <main className="mx-auto min-h-dvh max-w-4xl px-4 text-center">
        <h1 className="mb-4 pt-24 text-2xl font-bold leading-10 tracking-tight mb:text-5xl">
          Effortlessly Create and Manage Job Postings Across Multiple Job Boards
        </h1>
        <Button asChild className="mt-4 py-8 text-2xl font-bold">
          <Link href={"/admin/sign-up"}>Get Started For Free</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
