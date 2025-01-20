"use server";

import { db } from "@/db/index";
import { user, stripeCustomer } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(process.env.DEV_STRIPE_PRIVATE_KEY!);

export async function createStripeUser(userEmail: string): Promise<boolean> {
  try {
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .then((res) => res[0]);

    if (!currentUser) {
      console.error("User Not Found.");
      return false;
    }

    const stripeUser = await db
      .select()
      .from(stripeCustomer)
      .where(eq(stripeCustomer.userId, currentUser.id))
      .then((res) => res[0]);

    if (!stripeUser) {
      const customer = await stripe.customers.create({
        email: currentUser.email,
      });

      await db
        .insert(stripeCustomer)
        .values({ userId: currentUser.id, stripeId: customer.id });

      return true;
    } else {
      console.error("Existing Stripe User");
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return false;
    } else {
      console.error("Unexpected Error.");
      return false;
    }
  }
}
