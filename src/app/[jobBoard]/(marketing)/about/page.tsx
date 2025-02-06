import About from "@/app/[jobBoard]/(marketing)/about/about.mdx";
import { mdxComponents } from "@/app/[jobBoard]/(marketing)/components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto max-w-4xl py-20">
      <About components={mdxComponents} />
    </main>
  );
}
