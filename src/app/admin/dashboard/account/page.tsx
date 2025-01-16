import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { SessionLinks } from "@/app/admin/dashboard/lib/constants";
import Footer from "@/components/footer";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin");
  } else {
  }

  return (
    <div>
      <Navbar links={SessionLinks} />
      <div></div>
      <Footer />
    </div>
  );
}
