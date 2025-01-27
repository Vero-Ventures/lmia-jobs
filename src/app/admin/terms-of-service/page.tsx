import TermsOfService from "@/app/admin/terms-of-service/terms-of-service.mdx";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BaseLinks, SessionLinks } from "@/app/admin/dashboard/lib/constants";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const components = {
    h1: (props: string[]) => (
      <p
        className="mb:text-3xl mb-6 text-center text-2xl font-bold sm:text-4xl"
        {...props}
      />
    ),
    h2: (props: string[]) => (
      <p className="mt-6 mb-2 text-xl font-semibold" {...props} />
    ),
    h3: (props: string[]) => (
      <p className="text-center text-lg font-semibold" {...props} />
    ),
    p: (props: string[]) => <p className="leading-8" {...props} />,
    hr: (props: string[]) => <hr className="mt-4 mb-2" {...props} />,
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="border-opacity-60 mb:p-8 mx-auto my-6 w-3/4 max-w-4xl flex-grow rounded-lg border-4 border-gray-400 bg-white p-4 sm:my-8 lg:w-2/3">
        <TermsOfService components={components} />
      </div>
      <Footer />
    </div>
  );
}
