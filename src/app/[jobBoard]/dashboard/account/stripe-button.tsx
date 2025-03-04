"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { manageBilling } from "./actions";
import Link from "next/link";

export default function StripeBillingPortalButton({
  stripeCustomerId,
}: {
  stripeCustomerId: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const onSubscribe = async () => {
    try {
      setIsLoading(true);
      const { url } = await manageBilling({
        returnUrl: window.location.href,
      });
      window.location.href = url ?? "";
    } catch (error) {
      if (error instanceof Error) {
        console.error("STRIPE_CLIENT_ERROR", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return stripeCustomerId ? (
    <Button disabled={isLoading} size="lg" onClick={onSubscribe}>
      Manage Billing
    </Button>
  ) : (
    <Button asChild size="lg">
      <Link href="/pricing">See Pricing</Link>
    </Button>
  );
}
