"use client";

import TermsOfService from "@/app/[jobBoard]/(marketing)/terms-of-service/terms-of-service.mdx";
import { mdxComponents } from "@/app/[jobBoard]/(marketing)/components/mdx";

export default function Page() {
  // Convert the MDX file to a component that can be rendered.
  // The MDX components defines css rules for the MD elements.
  return (
    <main className="mx-auto my-12 w-11/12 max-w-4xl rounded-lg border-2 border-gray-300 px-6 pt-8">
      <TermsOfService components={mdxComponents} />
    </main>
  );
}
