import About from "@/app/admin/(marketing)/about/about.mdx";
import { mdxComponents } from "@/app/admin/(marketing)/components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto max-w-4xl py-20">
      <About components={mdxComponents} />
    </main>
  );
}
