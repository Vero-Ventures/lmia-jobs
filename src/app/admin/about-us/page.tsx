import AboutUs from "@/app/admin/about-us/about-us.mdx";
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
    <div className="flex min-h-dvh flex-col">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="rounded-lgp-4 mx-auto my-6 w-3/4 flex-grow mb:p-8 sm:my-8 lg:w-2/3">
        <AboutUs components={components} />
      </div>
      <Footer />
    </div>
  );
}
