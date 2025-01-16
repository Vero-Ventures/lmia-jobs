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
  tableId,
  tableKey,
  session,
  userEmail,
}: {
  tableId: string;
  tableKey: string;
  session: boolean;
  userEmail: string | undefined;
}) {
  console.log(process.env.DEV_PRICING_TABLE_ID);

  const [customerSession, setCustomerSession] = useState("");

  const fetchCustomerSession = async () => {
    const userStripeCustomerSession = await createCustomerSession(userEmail!);

    if ("customerSession" in userStripeCustomerSession) {
      const customerSession = (
        userStripeCustomerSession as {
          customerSession: string;
        }
      ).customerSession;
      setCustomerSession(customerSession);
    }
  };

  useEffect(() => {
    if (session) {
      console.log("check");
      fetchCustomerSession();
      const interval = setInterval(
        () => {
          fetchCustomerSession();
        },
        30 * 60 * 1000
      );
      return () => clearInterval(interval);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      redirect("/admin/sign-in");
    }
  };

  return (
    <div
      className="relative mx-auto my-6 w-fit rounded-lg border-4 border-gray-300 py-4 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl sm:px-6"
      onClick={handleClick}>
      <Script
        id="StripePricingTableScript"
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />

      <stripe-pricing-table
        pricing-table-id={tableId}
        publishable-key={tableKey}
        customer-session-client-secret={customerSession}
      />

      {!session && (
        <div className="absolute left-0 top-0 min-h-full min-w-full" />
      )}
    </div>
  );
}
