"use server";

import {
  getStripeCustomerId,
  storeStripeCustomerId,
} from "@/db/queries/stripeCustomer";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createCheckoutSession({
  jobPostingId,
  numMonths,
  numJobBoards,
}: {
  jobPostingId: number;
  numJobBoards: number;
  numMonths: number;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/");
  }

  const user = data.user;

  // Get the stripeCustomerId from your database
  let { id: stripeCustomerId } = await getStripeCustomerId(user.id);

  // Create a new Stripe customer if this user doesn't have one
  if (!stripeCustomerId) {
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id, // DO NOT FORGET THIS
      },
    });

    // Store the relation between userId and stripeCustomerId in your KV
    await storeStripeCustomerId(newCustomer.id, user.id);
    stripeCustomerId = newCustomer.id;
  }

  // ALWAYS create a checkout with a stripeCustomerId. They should enforce this.
  const checkout = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    success_url: `${process.env.BETTER_AUTH_URL}/payment-confirmed`,
    cancel_url: `${process.env.BETTER_AUTH_URL}/dashboard`,
    payment_intent_data: {
      metadata: {
        numJobBoards,
        numMonths,
        jobPostingId,
        userId: user.id,
      },
    },
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: `Post on up to ${numJobBoards} job boards for ${numMonths} months.`,
            description: `Create a job board posting to appear on up to ${numJobBoards} Opportunities job boards for the next
            ${numMonths} months.`,
          },
          unit_amount: numJobBoards * numMonths * 500,
        },
        quantity: 1,
      },
    ],
  });
  return checkout.url;
}
