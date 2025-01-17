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
      <div className="flex flex-grow flex-row items-center">
        <div className="mx-auto w-1/2 rounded-lg bg-white">
          <PricingInfo />
        </div>
        <div className="w-1/3">
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
