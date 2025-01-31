"use server";

import { getStripeCustomerId } from "@/db/queries/stripeCustomer";
import { stripe } from "@/lib/stripe";

export async function checkUserPurchases(userId: string): Promise<boolean> {
  try {
    const stripeCustomerId = await getStripeCustomerId(userId);

    if (!stripeCustomerId) {
      console.error("Stripe User Not Found");
      return false;
    } else {
      const customerPurchases = await stripe.charges.list({
        customer: stripeCustomerId,
      });

      const validPurchases: string[] = [];

      for (const purchase of customerPurchases.data) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          purchase.payment_intent as string
        );

        validPurchases.push(paymentIntent.metadata.postId);
      }

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
