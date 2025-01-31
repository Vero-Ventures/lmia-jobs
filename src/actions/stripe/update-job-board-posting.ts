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

  // Get the stripeCustomerId from your database
  const stripeCustomerId = await getStripeCustomerId(user.id);
  if (!stripeCustomerId) return;
  return await syncStripeDataToDatabase(stripeCustomerId);
}

export async function syncStripeDataToDatabase(customerId: string) {
  const purchases = await stripe.charges.list({
    customer: customerId,
  });

  if (purchases.data.length === 0) {
    return;
  }

  const purchase = purchases.data[0];

  const paymentIntent = await stripe.paymentIntents.retrieve(
    purchase.payment_intent as string
  );
  const jobPostingId = paymentIntent.metadata.jobPostingId;

  await db
    .update(jobPosting)
    .set({ paymentConfirmed: true })
    .where(eq(jobPosting.id, Number(jobPostingId)));
}
