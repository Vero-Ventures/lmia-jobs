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
      <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex items-center space-x-2">
            <span className="text-5xl font-bold tracking-tighter text-blue-800 mb:text-6xl">
              Opportunities Dashboard
            </span>
          </div>
          <h1 className="mb-4 mt-6 text-xl font-bold tracking-tight text-gray-900 mb:text-3xl">
            Easily Create And Manage Job Postings Across Multiple Boards
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row sm:space-x-12">
            <Button
              type="submit"
              className="mt-4 w-64 bg-blue-600 bg-gradient-to-r from-blue-500 to-blue-600 py-8 text-2xl font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              <Link href={"/admin/sign-up"}>Join Now</Link>
            </Button>
            <Button
              type="submit"
              className="mt-8 w-64 bg-blue-600 bg-gradient-to-r from-blue-500 to-blue-600 py-8 text-2xl font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 sm:mt-4">
              <Link href={"/admin/sign-in"}>Log In</Link>
            </Button>
          </div>
        </main>
        <footer className="mx-auto max-w-2xl p-4 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} LMIA Jobs - Developed by{" "}
            <a
              href="https://www.veroventures.com/"
              className="text-blue-600 hover:text-blue-700">
              Vero Ventures
            </a>
          </p>
        </footer>
        <Footer />
      </div>
    </div>
  );
}
