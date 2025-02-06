import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "./ui/button";
import { SignOut } from "./sign-out";

export default async function Navbar({ title }: { title?: string | null }) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const links = [
    { text: "Home", url: data ? "/dashboard" : "/" },
    { text: "Pricing", url: "/pricing" },
    { text: "Contact Us", url: "/contact-us" },
  ];

  return (
    <header className="flex min-h-32 flex-col items-center bg-gray-200 bg-opacity-60 px-2 mb:h-28 sm:h-24 sm:flex-row sm:px-4 md:h-20 md:px-6 lg:px-10">
      {!title ? (
        <Link
          className="mt-2 flex items-center justify-center text-center mb:mt-4 sm:mt-0"
          href={data ? "/dashboard" : "/"}>
          <span className="text-xl font-bold tracking-tighter mb:text-2xl">
            Manage Opportunities
          </span>
        </Link>
      ) : (
        <Link
          className="mt-2 flex items-center justify-center text-center mb:mt-4 sm:mt-0"
          href={`/`}>
          <span className="text-xl font-bold tracking-tighter text-primary mb:text-2xl">
            {title}
          </span>
        </Link>
      )}

      <nav className="mt-1 flex w-full flex-col items-center justify-center gap-0 mb:mt-1 mb:w-full mb:flex-row mb:justify-evenly mb:gap-2 mb:p-2 sm:mt-0 sm:pr-0 md:ml-auto md:w-fit md:justify-center md:gap-4 md:px-0 lg:gap-8">
        <div className="flex flex-row justify-evenly mb:w-3/4 mb:justify-evenly md:gap-2">
          {links.map((link) => (
            <Button
              key={link.text}
              asChild
              variant="link"
              className="h-fit !px-2 hover:bg-gray-300 sm:mt-2 sm:pb-3 md:!px-4">
              <Link
                className="font-sans !text-base mb:!text-lg sm:w-fit nb:!text-xl"
                href={link.url}>
                {link.text}
              </Link>
            </Button>
          ))}
          {!data && (
            <div>
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

        {!data ? (
          <>
            <SignOut />
          </>
        ) : (
          <>
            <Button asChild className="mb:ml-0">
              <Link
                className="mx-auto !px-4 font-sans !text-lg hover:bg-gray-500 mb:w-1/4 mb:max-w-28 sm:mt-2 sm:!text-xl md:!p-6"
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
