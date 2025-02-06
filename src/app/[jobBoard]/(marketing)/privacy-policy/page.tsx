import PrivacyPolicy from "@/app/[jobBoard]/(marketing)/privacy-policy/privacy-policy.mdx";
import { mdxComponents } from "@/app/[jobBoard]/(marketing)/components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto max-w-4xl py-20">
      <PrivacyPolicy components={mdxComponents} />
    </main>
  );
}
