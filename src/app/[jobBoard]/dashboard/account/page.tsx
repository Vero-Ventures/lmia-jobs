import { redirect } from "next/navigation";

import StripeBillingPortalButton from "./stripe-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UpdateEmailCard from "./update-email-card";
import { getStripeCustomerId } from "@/db/queries/stripeCustomer";

export default async function Page() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }

  const stripeCustomerId = await getStripeCustomerId(data.user.id);
  return (
    <main>
      <div className="space-y-4 p-20">
        <div className="flex justify-center">
          <StripeBillingPortalButton stripeCustomerId={stripeCustomerId} />
        </div>
        <UpdateEmailCard user={data.user} />
      </div>
    </main>
  );
}
