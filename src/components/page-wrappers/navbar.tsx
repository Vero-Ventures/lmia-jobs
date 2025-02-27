import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/components/inputs/sign-out";

let links = [
  { text: "Job Board", url: "/" },
  { text: "Pricing", url: "/pricing" },
  { text: "Contact Us", url: "/contact-us" },
];

export default async function Navbar({ title }: { title: string }) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  // Defines the session and non-session nav-bar links.
  if (data) {
    links = [
      { text: "Job Board", url: "/" },
      { text: "Pricing", url: "/pricing" },
      { text: "Contact Us", url: "/contact-us" },
      { text: "Dashboard", url: "/dashboard" },
      { text: "Account", url: "/dashboard/account" },
    ];
  } else {
    links = [
      { text: "Job Board", url: "/" },
      { text: "Pricing", url: "/pricing" },
      { text: "Contact Us", url: "/contact-us" },
    ];
  }

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
        <div className="mt-1 flex flex-row gap-1 sm:justify-evenly sm:pb-2 md:gap-2">
          {links.map((link) => (
            <Button
              key={link.text}
              asChild
              variant="link"
              className={`h-fit px-2 hover:bg-gray-300 sm:mt-2 md:px-4 ${data ? "w-fit" : "mx-2 min-w-20 sm:mx-0"}`}>
              <Link
                className={`font-sans mb:w-fit nav_sm:text-xl ${data ? "nav_mb:text-lg" : "!text-lg mb:!text-xl"}`}
                href={link.url}>
                {link.text}
              </Link>
            </Button>
          ))}
        </div>

        {data ? (
          <>
            <SignOut />
          </>
        ) : (
          <>
            <Button asChild>
              <Link
                className="my-2 mb-3 hover:bg-gray-400 mb:mx-4 mb:max-w-28 mb:!px-6 mb:!text-lg sm:mt-4 sm:!text-xl md:!p-6"
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
