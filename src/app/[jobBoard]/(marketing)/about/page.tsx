import About from "@/app/[jobBoard]/(marketing)/about/about.mdx";
import { mdxComponents } from "@/app/[jobBoard]/(marketing)/components/mdx";

export default async function Page() {
  return (
    <main className="mx-auto my-12 w-11/12 max-w-4xl rounded-lg border-2 border-gray-300 px-6 pt-8">
      <About components={mdxComponents} />
    </main>
  );
}
