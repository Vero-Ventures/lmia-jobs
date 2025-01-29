import PrivacyPolicy from "@/app/admin/(marketing)/privacy-policy/privacy-policy.mdx";
import { mdxComponents } from "../components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto max-w-4xl py-20">
      <PrivacyPolicy components={mdxComponents} />
    </main>
  );
}
