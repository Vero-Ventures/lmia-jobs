import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PricingTable from "./pricing-table";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin");
  }

  const pricingTableId = process.env.DEV_PRICING_TABLE_ID!;
  const pricingTableKey = process.env.DEV_STRIPE_PUBLIC_KEY!;

  return (
    <div>
      <PricingTable
        userEmail={session!.user.email}
        tableId={pricingTableId}
        tableKey={pricingTableKey}
      />
    </div>
  );
}
