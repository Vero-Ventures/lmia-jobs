"use client";

import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-gray-900 p-6 text-gray-50 md:py-6">
      <div className="container mx-auto hidden max-w-7xl grid-cols-3 gap-8 text-sm sm:grid">
        <div className="grid content-start justify-center gap-y-3 text-center text-base">
          <h3 className="text-xl font-semibold">Company</h3>
          <Link href="/admin/contact-us">Contact Us</Link>
          <Link href="/admin/pricing">Pricing</Link>
        </div>
        <div className="grid justify-center gap-1 text-center">
          <h3 className="mb-2 text-xl font-semibold">Job Sites</h3>
          <Link
            href="https://accessibleopportunities.ca/disability-job-board"
            className="ml-1 pb-1.5 text-base">
            Accessible Opportunities
          </Link>
          <Link
            href="https://asylumopportunities.ca/asylum-job-board"
            className="ml-1 pb-1.5 text-base">
            Asylum Opportunities
          </Link>
          <Link
            href="https://immigrantopportunities.ca/newcomers-job-board"
            className="ml-1 pb-1.5 text-base">
            Immigrant Opportunities
          </Link>
          <Link
            href="https://indigenousopportunities.ca/indigenous-job-board"
            className="ml-1 pb-1.5 text-base">
            Indigenous Opportunities
          </Link>
          <Link
            href="https://youthopportunities.ca/youth-job-board"
            className="ml-1 text-base">
            Youth Opportunities
          </Link>
        </div>
        <div className="grid content-start justify-center gap-y-4 text-center text-base">
          <h3 className="text-xl font-semibold">Legal</h3>
          <Link href="/admin/privacy-policy">Privacy Policy</Link>
          <Link href="/admin/terms-of-service">Terms of Service</Link>
        </div>
      </div>
      <div className="container mx-auto grid max-w-7xl grid-cols-2 justify-between gap-8 text-sm sm:hidden">
        <div className="mx-auto flex w-fit flex-col items-start justify-center gap-4">
          <div className="grid content-start justify-center gap-y-4 text-base">
            <h3 className="text-xl font-semibold">Company</h3>
            <Link href="/admin/contact-us">Contact Us</Link>
            <Link href="/admin/pricing">Pricing</Link>
          </div>
          <div className="mt-2 grid content-start justify-center gap-y-4 text-base">
            <h3 className="text-xl font-semibold">Legal</h3>
            <Link href="/admin/privacy-policy">Privacy Policy</Link>
            <Link href="/admin/terms-of-service">Terms of Service</Link>
          </div>
        </div>
        <div className="mx-auto grid w-fit justify-center gap-1 text-base">
          <h3 className="mb-2 text-xl font-semibold">Job Sites</h3>
          <Link
            href="https://accessibleopportunities.ca/disability-job-board"
            className="ml-1 pb-1.5">
            Accessible Opportunities
          </Link>
          <Link
            href="https://asylumopportunities.ca/asylum-job-board"
            className="ml-1 pt-1 pb-1.5">
            Asylum Opportunities
          </Link>
          <Link
            href="https://immigrantopportunities.ca/newcomers-job-board"
            className="ml-1 pt-1 pb-1.5">
            Immigrant Opportunities
          </Link>
          <Link
            href="https://indigenousopportunities.ca/indigenous-job-board"
            className="ml-1 pt-1 pb-1.5">
            Indigenous Opportunities
          </Link>
          <Link
            href="https://youthopportunities.ca/youth-job-board"
            className="ml-1 pt-1">
            Youth Opportunities
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
