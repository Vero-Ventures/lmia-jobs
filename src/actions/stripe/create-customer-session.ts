"use server";

import { db } from "@/db/index";
import { user, subscription } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(process.env.DEV_STRIPE_PRIVATE_KEY!);

export async function createCustomerSession(
  userEmail: string
): Promise<{ customerSession: string } | { error: string }> {
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

    const customerSession = await stripe.customerSessions.create({
      customer: userSubscription.stripeId,
      components: {
        pricing_table: {
          enabled: true,
        },
      },
    });

    return {
      customerSession: customerSession.client_secret,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unexpected Error." };
    }
  }
}
