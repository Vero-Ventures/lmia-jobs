import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "./ui/button";
import { SignOut } from "./sign-out";

const links = [
  { text: "Home", url: "/" },
  { text: "Pricing", url: "/pricing" },
  { text: "Contact Us", url: "/contact-us" },
];

export default async function Navbar({ title }: { title: string }) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="flex flex-col items-center bg-gray-200 bg-opacity-60 px-2 sm:px-4 md:px-6 lg:flex-row lg:px-10">
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

      <nav className="flex w-full flex-col items-center justify-center gap-0 sm:mt-0 sm:w-full sm:flex-row sm:justify-evenly sm:gap-2 sm:p-2 md:w-fit md:justify-center md:gap-4 md:px-0 md:pt-0 lg:ml-auto">
        <div className="my-1 flex flex-row justify-center gap-1 mb:w-full mb:gap-2 sm:justify-evenly">
          {links.map((link) => (
            <Button
              key={link.text}
              asChild
              variant="link"
              className={`h-fit !px-2 hover:bg-gray-300 sm:mt-2 sm:pb-3 md:!px-4 ${!data ? "w-fit" : "mb:w-24"}`}>
              <Link
                className="font-sans !text-base mb:w-fit mb:!text-lg nb:!text-xl"
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
                className="h-fit !px-2 hover:bg-gray-300 sm:mt-2 sm:pb-3 md:!px-4">
                <Link
                  className="font-sans !text-base mb:!text-lg sm:w-fit nb:!text-xl"
                  href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="h-fit !px-2 hover:bg-gray-300 sm:mt-2 sm:pb-3 md:!px-4">
                <Link
                  className="font-sans !text-base mb:!text-lg sm:w-fit nb:!text-xl"
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
                className="mx-auto mb-2 !px-4 font-sans !text-lg hover:bg-gray-500 mb:w-1/4 mb:max-w-28 sm:mb-0 sm:mt-2 sm:!text-xl md:!p-6"
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
