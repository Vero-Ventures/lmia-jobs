"use server";

import { db } from "@/db/index";
import { user, userStripe } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(process.env.DEV_STRIPE_PRIVATE_KEY!);

export async function createStripeUser(
  userEmail: string
): Promise<{ result: string } | { error: string }> {
  try {
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .then((res) => res[0]);

    if (!currentUser) {
      return { error: "User Not Found." };
    }

    const stripeUser = await db
      .select()
      .from(userStripe)
      .where(eq(userStripe.userId, userEmail))
      .then((res) => res[0]);

    if (!stripeUser) {
      const customer = await stripe.customers.create({
        email: currentUser.email,
      });

      await db
        .insert(userStripe)
        .values({ userId: currentUser.id, stripeId: customer.id });

      return { result: "created" };
    } else {
      return { result: "existing" };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unexpected Error." };
    }
  }
}
