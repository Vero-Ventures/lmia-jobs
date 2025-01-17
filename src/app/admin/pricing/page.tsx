import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import { BaseLinks, SessionLinks } from "@/app/admin/dashboard/lib/constants";
import Footer from "@/components/footer";
import PricingInfo from "@/app/admin/pricing/pricing-info.mdx";
import PricingTable from "./pricing-table";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pricingTableId = process.env.DEV_PRICING_TABLE_ID!;
  const pricingTableKey = process.env.DEV_STRIPE_PUBLIC_KEY!;

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="flex flex-grow flex-col items-center md:flex-row md:justify-between md:px-6 lg:px-12 xl:px-24">
        <div className="mx-auto mt-8 w-4/5 rounded-lg bg-white p-4 md:mx-0 md:w-3/5 lg:mx-auto lg:w-1/2">
          <PricingInfo />
        </div>
        <div className="md:w-1/3">
          <PricingTable
            userEmail={session?.user.email}
            tableId={pricingTableId}
            tableKey={pricingTableKey}
            session={session !== null}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
