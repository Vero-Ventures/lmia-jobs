import PrivacyPolicy from "@/app/[jobBoard]/(marketing)/privacy-policy/privacy-policy.mdx";
import { mdxComponents } from "@/app/[jobBoard]/(marketing)/components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto my-12 max-w-4xl rounded-lg border-2 border-gray-300 px-6 pt-8">
      <PrivacyPolicy components={mdxComponents} />
    </main>
  );
}
