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
      <div className="mx-auto my-8 w-2/3 flex-grow rounded-lg bg-white px-8 py-10">
        <PrivacyPolicy components={components} />
      </div>
      <Footer />
    </div>
  );
}