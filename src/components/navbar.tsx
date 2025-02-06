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
    <header className="flex h-16 flex-col items-center bg-secondary p-4 sm:h-14 sm:flex-row lg:p-10">
      <Link className="flex items-center justify-center" href={"/"}>
        <span className="text-xl font-bold tracking-tighter text-primary">
          {title}
        </span>
      </Link>
      <nav className="flex items-center justify-center gap-4 sm:ml-auto sm:mt-0 sm:gap-6">
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
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="link">
              <Link href="/dashboard/account">Account</Link>
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
