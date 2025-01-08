"use client";

import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-gray-900 p-6 text-gray-50 md:py-12">
      <div className="container mx-auto grid max-w-7xl grid-cols-3 gap-8 text-sm">
        <div className="grid content-start justify-center gap-y-4 text-base">
          <h3 className="text-xl font-semibold">Company</h3>
          <Link href="/coming-soon" className="h-fit pb-1">
            About Us
          </Link>
          <Link href="/coming-soon" className="pb-1">
            Contact
          </Link>
        </div>
        <div className="grid justify-center gap-1">
          <h3 className="mb-2 text-xl font-semibold">Job Sites</h3>
          <Link
            href="https://lmia-jobs-indigenous.vercel.app"
            target="_blank"
            className="ml-1 pb-1.5">
            Indigenous People
          </Link>
          <Link
            href="https://lmia-jobs-newcomers.vercel.app"
            target="_blank"
            className="ml-1 pb-1.5">
            Newcomers
          </Link>
          <Link
            href="https://lmia-jobs-disabled.vercel.app"
            target="_blank"
            className="ml-1 pb-1.5">
            Persons with Disabilities
          </Link>
          <Link
            href="https://lmia-jobs-youth.vercel.app"
            target="_blank"
            className="ml-1 pb-1.5">
            Vulnerable Youth
          </Link>
          <Link
            href="https://lmia-jobs-asylum.vercel.app"
            target="_blank"
            className="ml-1">
            Asylum-Refugees
          </Link>
        </div>
        <div className="grid content-start justify-center gap-y-4 text-base">
          <h3 className="text-xl font-semibold">Legal</h3>
          <Link href="/coming-soon">Privacy Policy</Link>
          <Link href="/coming-soon">Terms of Service</Link>
          <Link href="/coming-soon">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
