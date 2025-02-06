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
    <header className="flex h-16 flex-col items-center bg-white px-4 sm:h-14 sm:flex-row lg:px-6">
      <Link className="flex items-center justify-center" href={"/"}>
        <span className="text-xl font-bold tracking-tighter text-primary">
          {title}
        </span>
      </Link>
      <nav className="flex items-center justify-center gap-4 py-2 sm:ml-auto sm:mt-0 sm:gap-6">
        {links.map((link) => (
          <Button key={link.text} asChild variant="link">
            <Link href={link.url}>{link.text}</Link>
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
              <Link href="/sign-in">Log In</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
