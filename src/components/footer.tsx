"use client";

import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-gray-900 p-6 text-gray-50 md:py-12">
      <div className="container grid max-w-7xl grid-cols-4 gap-8 text-sm sm:grid-cols-3 md:grid-cols-4">
        <div className="grid justify-center gap-1">
          <h3 className="text-lg font-semibold">Company</h3>
          <Link href="/coming-soon" className="ml-1 pb-1">
            About Us
          </Link>
          <Link href="/coming-soon" className="ml-1 pb-1">
            Our Team
          </Link>
          <Link href="/coming-soon" className="ml-1 pb-1">
            Careers
          </Link>
          <Link href="/coming-soon" className="ml-1 pb-1">
            News
          </Link>
        </div>
        <div className="grid justify-center gap-1">
          <h3 className="text-lg font-semibold">Job Sites</h3>
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
        <div className="grid justify-center gap-1">
          <h3 className="text-lg font-semibold">Legal</h3>
          <Link href="/coming-soon" className="ml-1">
            Privacy Policy
          </Link>
          <Link href="/coming-soon" className="ml-1">
            Terms of Service
          </Link>
          <Link href="/coming-soon" className="ml-1">
            Cookie Policy
          </Link>
        </div>
        <div className="grid justify-center gap-1">
          <h3 className="text-lg font-semibold">Contact</h3>
          <Link href="/coming-soon" className="ml-1">
            Support
          </Link>
          <Link href="/coming-soon" className="ml-1">
            Sales
          </Link>
          <Link href="/coming-soon" className="ml-1">
            Partnerships
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
