import PrivacyPolicy from "@/app/admin/privacy-policy/privacy-policy.mdx";
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
    // p: (props: string[]) => <p className="" {...props} />,
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="mx-auto my-6 w-3/4 flex-grow rounded-lg border-4 border-gray-400 border-opacity-60 bg-white p-8 sm:my-8 lg:w-2/3">
        <PrivacyPolicy components={components} />
      </div>
      <Footer />
    </div>
  );
}
