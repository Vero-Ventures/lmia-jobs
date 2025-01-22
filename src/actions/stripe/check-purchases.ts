"use server";

import { db } from "@/db/index";
import { user, stripeCustomer, jobPostings } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_CONFIG! === "production"
    ? process.env.PRODUCTION_STRIPE_PRIVATE_KEY!
    : process.env.DEVELOPER_STRIPE_PRIVATE_KEY!
);

export async function checkUserPurchases(userEmail: string): Promise<string> {
  try {
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .then((res) => res[0]);

    if (!currentUser) {
      console.error("User Not Found.");
      return "error";
    }

    const stripeUser = await db
      .select()
      .from(stripeCustomer)
      .where(eq(stripeCustomer.userId, currentUser.id))
      .then((res) => res[0]);

    if (!stripeUser) {
      console.error("Stripe User Not Found");
      return "error";
    } else {
      const customerPurchases = await stripe.charges.list({
        customer: stripeUser.stripeId,
      });

      const customerPosts = await db
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.email, currentUser.email));

      let result = "success";

      for (const purchase of customerPurchases.data) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          purchase.payment_intent as string
        );

        const purchasePost = customerPosts.find(
          (post) => post.id === paymentIntent.metadata.postId
        );

        if (purchasePost && !purchasePost.paymentConfirmed) {
          await db
            .update(jobPostings)
            .set({ paymentConfirmed: true, hidden: false })
            .where(eq(jobPostings.id, purchasePost!.id));

          result = "refresh";
        }
      }

      await db
        .delete(jobPostings)
        .where(eq(jobPostings.paymentConfirmed, false));

      return result;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return "error";
    } else {
      console.error("Unexpected Error.");
      return "error";
    }
  }
}
