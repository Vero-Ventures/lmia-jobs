"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function Navbar({ links }) {
  const router = useRouter();
  return (
    <header className="flex h-16 flex-col items-center border-y px-4 sm:h-14 sm:flex-row lg:px-6">
      <Link className="flex items-center justify-center" href="/admin">
        <BriefcaseIcon className="h-6 w-6" />
        <span className="ml-2 font-semibold">LMIA Opportunities</span>
      </Link>
      <nav className="flex items-center justify-center gap-4 py-2 sm:ml-auto sm:mt-0 sm:gap-6">
        {links.map((link, index) =>
          link.text === "Log Out" ? (
            <button
              key={index}
              className="text-sm font-medium underline-offset-4 hover:underline sm:text-base"
              onClick={async () => {
                 await signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/admin");
                    },
                  },
                });
              }}>
              Log Out
            </button>
          ) : (
            <Link
              key={index}
              className="text-sm font-medium underline-offset-4 hover:underline sm:text-base"
              href={link.url}>
              {link.text}
            </Link>
          )
        )}
      </nav>
    </header>
  );
}

function BriefcaseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

export default Navbar;
