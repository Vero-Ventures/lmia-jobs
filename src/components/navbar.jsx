"use client";

import React from "react";
import Link from "next/link";

function Navbar({ links }) {
  return (
    <header className="flex h-14 items-center border-y px-4 lg:px-6">
      <Link className="flex items-center justify-center" href="/">
        <BriefcaseIcon className="h-6 w-6" />
        <span className="ml-2 font-semibold">Opportunites Dashboard</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {links.map((link, index) => (
          <Link
            key={index}
            className="text-sm font-medium underline-offset-4 hover:underline"
            href={link.url}>
            {link.text}
          </Link>
        ))}
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
