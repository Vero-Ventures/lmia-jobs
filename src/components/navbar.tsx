import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "./ui/button";
import { SignOut } from "./sign-out";

const links = [
  { text: "Job Board", url: "/" },
  { text: "Pricing", url: "/pricing" },
  { text: "Contact Us", url: "/contact-us" },
];

export default async function Navbar({ title }: { title: string }) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="flex flex-col items-center bg-gray-200 bg-opacity-60 px-2 sm:px-4 md:px-6 lg:flex-row">
      {!title ? (
        <Link
          className="flex items-center justify-center text-center mb:mt-4 lg:mt-0"
          href={data ? "/dashboard" : "/"}>
          <span className="text-xl font-bold tracking-tighter mb:text-2xl">
            Manage Opportunities
          </span>
        </Link>
      ) : (
        <Link
          className="mt-2 flex items-center justify-center text-center mb:mt-4 lg:mt-0"
          href={`/`}>
          <span className="text-xl font-bold tracking-tighter text-primary mb:text-2xl">
            {title}
          </span>
        </Link>
      )}

      <nav className="flex w-full flex-col items-center justify-center sm:flex-row sm:p-2 md:w-fit md:p-0 lg:ml-auto lg:gap-2">
        <div className="my-1 flex flex-row gap-1 sm:justify-evenly sm:pb-2 md:gap-2">
          {links.map((link) => (
            <Button
              key={link.text}
              asChild
              variant="link"
              className={`h-fit !px-2 hover:bg-gray-300 sm:mt-2 md:!px-4 ${data ? "w-fit" : ""}`}>
              <Link
                className={`font-sans !text-base mb:w-fit nb:!text-xl ${data ? "sm:!text-lg" : "mx-2 mb:!text-lg md:mx-0"}`}
                href={link.url}>
                {link.text}
              </Link>
            </Button>
          ))}
          {data && (
            <div className="flex flex-row gap-2">
              <Button
                asChild
                variant="link"
                className="h-fit !px-2 hover:bg-gray-300 sm:mt-2 md:!px-4">
                <Link
                  className="font-sans !text-base sm:w-fit sm:!text-lg nb:!text-xl"
                  href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="h-fit !px-2 hover:bg-gray-300 sm:mt-2 md:!px-4">
                <Link
                  className="font-sans !text-base sm:w-fit sm:!text-lg nb:!text-xl"
                  href="/dashboard/account">
                  Account
                </Link>
              </Button>
            </div>
          )}
        </div>

        {data ? (
          <>
            <SignOut />
          </>
        ) : (
          <>
            <Button asChild className="">
              <Link
                className="mx-auto mb-2 !px-6 !text-lg hover:bg-gray-400 mb:mx-4 mb:max-w-28 sm:mt-2 sm:!text-xl md:!p-6"
                href="/sign-in">
                Log In
              </Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
