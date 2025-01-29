"use server";

import { db } from "@/db/index";
import { stripeCustomer, jobPosting } from "@/db/schema";
import { eq, inArray, notInArray } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_CONFIG! === "production"
    ? process.env.PRODUCTION_STRIPE_PRIVATE_KEY!
    : process.env.DEVELOPER_STRIPE_PRIVATE_KEY!
);

export async function checkUserPurchases(userId: string): Promise<boolean> {
  try {
    const stripeUser = await db
      .select()
      .from(stripeCustomer)
      .where(eq(stripeCustomer.userId, userId))
      .then((res) => res[0]);

    if (!stripeUser) {
      console.error("Stripe User Not Found");
      return false;
    } else {
      const customerPurchases = await stripe.charges.list({
        customer: stripeUser.stripeId,
      });

      const validPurchases: string[] = [];

      for (const purchase of customerPurchases.data) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          purchase.payment_intent as string
        );

        validPurchases.push(paymentIntent.metadata.postId);
      }

      await db
        .update(jobPosting)
        .set({ paymentConfirmed: true })
        .where(inArray(jobPosting.id, validPurchases));

      await db
        .delete(jobPosting)
        .where(notInArray(jobPosting.id, validPurchases));

      return true;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error Checking Purchase: " + error.message);
      return false;
    } else {
      console.error("Unexpected Error Checking Purchases.");
      return false;
    }
  }
}
