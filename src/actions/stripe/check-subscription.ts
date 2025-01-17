"use server";

import { db } from "@/db/index";
import { user, subscription } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(process.env.DEV_STRIPE_PRIVATE_KEY!);

export async function checkSubscription(
  userEmail: string
): Promise<{ status: string; valid: boolean } | { error: string }> {
  try {
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .then((res) => res[0]);

    if (!currentUser) {
      return { error: "No User Found" };
    }

    const userSubscription = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, currentUser.id))
      .then((res) => res[0]);

    if (!userSubscription) {
      return { error: "No User Subscription Found" };
    }

    const stripeSubscription = await stripe.subscriptions.list({
      customer: userSubscription.stripeId,
    });

    const subStatus = stripeSubscription.data[0]?.status;
    return {
      status: subStatus || "inactive",
      valid: subStatus === "active" || subStatus === "trialing",
    };
  } catch {
    return {
      status: "inactive",
      valid: false,
    };
  }
}
