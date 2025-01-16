"use client";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

import { useEffect, useState } from "react";

import Script from "next/script";

import { createCustomerSession } from "@/actions/stripe";
import { redirect } from "next/navigation";

export default function PricingTable({
  userEmail,
  tableId,
  tableKey,
}: {
  userEmail: string;
  tableId: string;
  tableKey: string;
}) {
  console.log(process.env.DEV_PRICING_TABLE_ID);

  const [customerSession, setCustomerSession] = useState("");

  const fetchCustomerSession = async () => {
    const userStripeCustomerSession = await createCustomerSession(userEmail);

    if ("error" in userStripeCustomerSession) {
      redirect("/admin/dashboard");
    } else {
      const customerSession = (
        userStripeCustomerSession as {
          customerSession: string;
        }
      ).customerSession;
      setCustomerSession(customerSession);
    }
  };

  useEffect(() => {
    fetchCustomerSession();
    const interval = setInterval(
      () => {
        fetchCustomerSession();
      },
      30 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto my-6 w-fit rounded-lg border-4 border-gray-300 py-4 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl sm:px-6">
      <Script
        id="StripePricingTableScript"
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />
      {customerSession && (
        <stripe-pricing-table
          pricing-table-id={tableId}
          publishable-key={tableKey}
          customer-session-client-secret={customerSession}
        />
      )}
    </div>
  );
}
