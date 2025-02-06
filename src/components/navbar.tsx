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
    <header className="flex h-24 flex-col items-center bg-gray-200 bg-opacity-60 px-2 mb:h-28 sm:h-24 sm:flex-row sm:px-4 md:h-20 md:px-6 lg:px-10">
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

      <nav className="flex items-center justify-center gap-2 py-2 mb:mt-1 mb:w-full mb:justify-between mb:px-4 sm:mt-0 sm:pr-0 md:ml-auto md:w-fit md:justify-center md:gap-4 md:px-0 lg:gap-8">
        {links.map((link) => (
          <Button
            key={link.text}
            asChild
            variant="link"
            className="h-fit hover:bg-gray-300 sm:mt-2 sm:pb-3">
            <Link className="font-sans !text-lg sm:!text-xl" href={link.url}>
              {link.text}
            </Link>
          </Button>
        ))}

        {data ? (
          <>
            <Button asChild variant="link">
              <Link
                className="font-sans !text-lg sm:!text-xl"
                href="/dashboard/account">
                Account
              </Link>
            </Button>
            <SignOut />
          </>
        ) : (
          <>
            <Button asChild>
              <Link
                className="!px-4 font-sans !text-lg sm:mt-2 sm:!text-xl md:!p-6"
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
