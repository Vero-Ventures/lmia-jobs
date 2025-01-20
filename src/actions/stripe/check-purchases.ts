"use server";

import { db } from "@/db/index";
import { user, stripeCustomer, jobPostings } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";
import { createNewPost } from "@/actions/handle-job-posts";

const stripe = new Stripe(process.env.DEV_STRIPE_PRIVATE_KEY!);

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

      for (const customerPost of customerPurchases.data) {
        const existingPost = customerPosts.find(
          (post) => post.stripeChargeId === customerPost.id
        );

        if (!existingPost) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            customerPurchases.data[0].payment_intent as string
          );

          const result = await createNewPost(
            customerPost.id,
            Number(paymentIntent.metadata.boards),
            Number(paymentIntent.metadata.time),
            currentUser.email
          );

          if (result === "refresh") {
            return result;
          }
        }
      }

      return "success";
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
