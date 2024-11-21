import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-gray-900 p-6 text-gray-50 md:py-12">
      <div className="container grid max-w-7xl grid-cols-4 gap-8 text-sm sm:grid-cols-3 md:grid-cols-4">
        <div className="grid gap-1">
          <h3 className="font-semibold">Company</h3>
          <Link href="/coming-soon">About Us</Link>
          <Link href="/coming-soon">Our Team</Link>
          <Link href="/coming-soon">Careers</Link>
          <Link href="/coming-soon">News</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Job Sites</h3>
          <Link href="https://lmia-jobs-indigenous.vercel.app" target="_blank">
            Indigenous People
          </Link>
          <Link href="https://lmia-jobs-newcomers.vercel.app" target="_blank">
            Newcomers
          </Link>
          <Link href="https://lmia-jobs-disabled.vercel.app" target="_blank">
            Persons with Disabilities
          </Link>
          <Link href="https://lmia-jobs-youth.vercel.app" target="_blank">
            Vulnerable Youth
          </Link>
          <Link href="https://lmia-jobs-asylum.vercel.app" target="_blank">
            Asylum-Refugees
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Legal</h3>
          <Link href="/coming-soon">Privacy Policy</Link>
          <Link href="/coming-soon">Terms of Service</Link>
          <Link href="/coming-soon">Cookie Policy</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Contact</h3>
          <Link href="/coming-soon">Support</Link>
          <Link href="/coming-soon">Sales</Link>
          <Link href="/coming-soon">Partnerships</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
