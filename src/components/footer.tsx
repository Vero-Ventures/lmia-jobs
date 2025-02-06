import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="mt-auto w-full bg-gray-200 bg-opacity-60 p-6 md:py-6">
      <div className="container mx-auto hidden max-w-7xl grid-cols-3 gap-8 text-sm md:grid">
        <div className="grid content-start justify-center gap-y-3 text-center text-base">
          <h3 className="mb-2 text-xl font-semibold">Company</h3>
          <Link href="/about">About</Link>
          <Link href="/contact-us">Contact Us</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <div className="grid justify-center gap-1 text-center">
          <h3 className="mb-2 text-xl font-semibold">
            Opportunities Job Sites
          </h3>
          <div className="flex-grid mt-2 flex grid-cols-2 gap-12">
            <div className="flex max-w-32 flex-col gap-2">
              <a
                target="_blank"
                href="https://allopportunities.ca"
                className="ml-1 pb-1.5 text-base">
                All Opportunities
              </a>
              <a
                target="_blank"
                href="https://asylumopportunities.ca"
                className="ml-1 pb-1.5 text-base">
                Asylum Opportunities
              </a>
              <a
                target="_blank"
                href="https://indigenousopportunities.ca"
                className="ml-1 pb-1.5 text-base">
                Indigenous Opportunities
              </a>
            </div>
            <div className="flex max-w-32 flex-col gap-2">
              <a
                target="_blank"
                href="https://accessibleopportunities.ca"
                className="ml-1 pb-1.5 text-base">
                Accessible Opportunities
              </a>
              <a
                target="_blank"
                href="https://immigrantopportunities.ca"
                className="ml-1 pb-1.5 text-base">
                Immigrant Opportunities
              </a>
              <a
                target="_blank"
                href="https://youthopportunities.ca"
                className="ml-1 text-base">
                Youth Opportunities
              </a>
            </div>
          </div>
        </div>
        <div className="grid content-start justify-center gap-y-4 text-center text-base">
          <h3 className="mb-2 text-xl font-semibold">Legal</h3>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
      <div className="container mx-auto grid max-w-7xl grid-cols-2 justify-between gap-8 text-sm sm:w-4/5 md:hidden">
        <div className="mx-auto flex w-fit flex-col items-start justify-center gap-4">
          <div className="grid content-start justify-center gap-y-4 text-base">
            <h3 className="text-xl font-semibold">Company</h3>
            <Link href="/about">About</Link>
            <Link href="/contact-us">Contact Us</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div className="mt-2 grid content-start justify-center gap-y-4 text-base">
            <h3 className="text-xl font-semibold">Legal</h3>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
        <div className="mx-auto grid w-fit justify-center gap-1 text-base">
          <h3 className="mb-2 text-xl font-semibold">
            Opportuntities <span className="mt-2 block">Job Sites</span>
          </h3>
          <Link href="https://allopportunities.ca" className="ml-1 pb-1.5">
            All Opportunities
          </Link>
          <Link
            href="https://accessibleopportunities.ca"
            className="ml-1 pb-1.5 pt-1">
            Accessible Opportunities
          </Link>
          <Link
            href="https://asylumopportunities.ca"
            className="ml-1 pb-1.5 pt-1">
            Asylum Opportunities
          </Link>
          <Link
            href="https://immigrantopportunities.ca"
            className="ml-1 pb-1.5 pt-1">
            Immigrant Opportunities
          </Link>
          <Link
            href="https://indigenousopportunities.ca"
            className="ml-1 pb-1.5 pt-1">
            Indigenous Opportunities
          </Link>
          <Link href="https://youthopportunities.ca" className="ml-1 pt-1">
            Youth Opportunities
          </Link>
        </div>
      </div>
      <p className="mt-8 text-center">
        © {new Date().getFullYear()} LMIA Jobs - Developed by{" "}
        <a
          href="https://www.veroventures.com/"
          className="text-blue-600 hover:text-blue-700">
          Vero Ventures
        </a>
      </p>
    </footer>
  );
}

export default Footer;
