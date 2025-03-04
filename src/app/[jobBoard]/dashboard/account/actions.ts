"use server";
import { getStripeCustomerId } from "@/db/queries/stripeCustomer";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

export async function manageBilling({ returnUrl }: { returnUrl: string }) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    return unauthorized();
  }
  const { user } = data;

  // Get subscription
  const stripeCustomerId = await getStripeCustomerId(user.id);

  // If the user is subscribed, take the user to the billing page
  if (stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    return { url: stripeSession.url };
  }
  return { url: null };
}
