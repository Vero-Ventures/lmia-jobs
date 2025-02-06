import TermsOfService from "@/app/[jobBoard]/(marketing)/terms-of-service/terms-of-service.mdx";
import { mdxComponents } from "@/app/[jobBoard]/(marketing)/components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto max-w-4xl py-20">
      <TermsOfService components={mdxComponents} />
    </main>
  );
}
