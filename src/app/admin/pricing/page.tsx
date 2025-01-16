import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import { BaseLinks, SessionLinks } from "@/app/admin/dashboard/lib/constants";
import Footer from "@/components/footer";
import PricingTable from "./pricing-table";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pricingTableId = process.env.DEV_PRICING_TABLE_ID!;
  const pricingTableKey = process.env.DEV_STRIPE_PUBLIC_KEY!;

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar links={session ? SessionLinks : BaseLinks} />
      <div className="flex flex-grow items-center">
        <PricingTable
          userEmail={session?.user.email}
          tableId={pricingTableId}
          tableKey={pricingTableKey}
          session={session !== null}
        />
      </div>
      <Footer />
    </div>
  );
}
