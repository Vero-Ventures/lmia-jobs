"use server";

import { db } from "@/db";
import { getStripeCustomerId } from "@/db/queries/stripeCustomer";
import { jobPosting } from "@/db/schema";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function triggerStripeSyncForUser() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) return;

  const user = data.user;

  // Get the stripeCustomerId from the database.
  const stripeCustomerId = await getStripeCustomerId(user.id);

  // If the Stripe customer ID exists, sync the data.
  if (stripeCustomerId) {
    return await syncStripeDataToDatabase(stripeCustomerId);
  } else {
    return;
  }
}

// Takes: The Stripe customer ID to sync data for.
export async function syncStripeDataToDatabase(customerId: string) {
  // Get the users Stripe purchases.
  const purchases = await stripe.charges.list({
    customer: customerId,
  });

  if (purchases.data.length === 0) {
    return;
  }

  const purchase = purchases.data[0];

  // Use the stripe Id to get the job posting Id from the purchase metadata
  const paymentIntent = await stripe.paymentIntents.retrieve(
    purchase.payment_intent as string
  );
  const jobPostingId = paymentIntent.metadata.jobPostingId;

  // Update the job posting in the database with payment confirmation as true.
  await db
    .update(jobPosting)
    .set({ paymentConfirmed: true })
    .where(eq(jobPosting.id, Number(jobPostingId)));
}
