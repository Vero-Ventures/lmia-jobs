"use client";

import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-gray-900 p-6 text-gray-50 md:py-12">
      <div className="container mx-auto hidden max-w-7xl grid-cols-3 gap-8 text-sm sm:grid">
        <div className="grid content-start justify-center gap-y-4 text-base">
          <h3 className="text-xl font-semibold">Company</h3>
          <Link href="/about-us" className="h-fit pb-1">
            About Us
          </Link>
          <Link href="/contact-us" className="pb-1">
            Contact Us
          </Link>
        </div>
        <div className="grid justify-center gap-1">
          <h3 className="mb-2 text-xl font-semibold">Job Sites</h3>
          <Link
            href="https://lmia-jobs.vercel.app/indigenous"
            target="_blank"
            className="ml-1 pb-1.5">
            Indigenous People
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/newcomers"
            target="_blank"
            className="ml-1 pb-1.5">
            Newcomers
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/disabled"
            target="_blank"
            className="ml-1 pb-1.5">
            Persons with Disabilities
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/youth"
            target="_blank"
            className="ml-1 pb-1.5">
            Vulnerable Youth
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/asylum"
            target="_blank"
            className="ml-1">
            Asylum-Refugees
          </Link>
        </div>
        <div className="grid content-start justify-center gap-y-4 text-base">
          <h3 className="text-xl font-semibold">Legal</h3>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/cookie-useage">Cookie Useage</Link>
        </div>
      </div>
      <div className="container mx-auto grid max-w-7xl grid-cols-2 justify-between gap-8 text-sm sm:hidden">
        <div className="mx-auto flex w-fit flex-col items-start justify-center gap-4">
          <div className="grid content-start justify-center gap-y-4 text-base">
            <h3 className="text-xl font-semibold">Company</h3>
            <Link href="/about-us" className="h-fit pb-1">
              About Us
            </Link>
            <Link href="/contact-us" className="pb-1">
              Contact
            </Link>
          </div>
          <div className="mt-4 grid content-start justify-center gap-y-4 text-base">
            <h3 className="text-xl font-semibold">Legal</h3>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/cookie-useage">Cookie Useage</Link>
          </div>
        </div>
        <div className="mx-auto grid w-fit justify-center gap-1 text-base">
          <h3 className="mb-2 text-xl font-semibold">Job Sites</h3>
          <Link
            href="https://lmia-jobs.vercel.app/indigenous"
            target="_blank"
            className="ml-1 pb-1.5">
            Indigenous People
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/newcomers"
            target="_blank"
            className="ml-1 pb-1.5 pt-1">
            Newcomers
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/disabled"
            target="_blank"
            className="ml-1 pb-1.5 pt-1">
            Persons with Disabilities
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/youth"
            target="_blank"
            className="ml-1 pb-1.5 pt-1">
            Vulnerable Youth
          </Link>
          <Link
            href="https://lmia-jobs.vercel.app/asylum"
            target="_blank"
            className="ml-1 pt-1">
            Asylum-Refugees
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
