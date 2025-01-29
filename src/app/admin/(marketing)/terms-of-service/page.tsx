import TermsOfService from "@/app/admin/(marketing)/terms-of-service/terms-of-service.mdx";
import { mdxComponents } from "../components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto max-w-4xl py-20">
      <TermsOfService components={mdxComponents} />
    </main>
  );
}
