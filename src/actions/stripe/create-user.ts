"use server";

import { db } from "@/db/index";
import { user, userMailing, stripeCustomer } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

// Create dev or prod Stripe instance based on Stripe config value.
const stripe = new Stripe(
  process.env.STRIPE_CONFIG! === "production"
    ? process.env.PRODUCTION_STRIPE_PRIVATE_KEY!
    : process.env.DEVELOPER_STRIPE_PRIVATE_KEY!
);

// Takes: The email of the user to create a Stripe user for.
// Returns: A boolean indicating success or failure.
export async function createStripeUser(userEmail: string): Promise<boolean> {
  try {
    // Check for the user in the database.
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .then((res) => res[0]);

    if (!currentUser) {
      console.error("User Not Found.");
      return false;
    }

    // Check if the user already has a Stripe user.
    const stripeUser = await db
      .select()
      .from(stripeCustomer)
      .where(eq(stripeCustomer.userId, currentUser.id))
      .then((res) => res[0]);

    if (!stripeUser) {
      // If no Stripe user exists, create one with the user's email.
      const customer = await stripe.customers.create({
        email: currentUser.email,
      });

      // Insert the Stripe user into the database.
      await db
        .insert(stripeCustomer)
        .values({ userId: currentUser.id, id: customer.id });

      // Find the user's mailing list entry and set it as activated.
      const scrapedUser = await db
        .select()
        .from(userMailing)
        .where(eq(userMailing.email, currentUser.email));

      if (scrapedUser[0]) {
        await db.update(userMailing).set({ activated: true });
      }

      // Return true on creation success or false if an existing Stripe user was found.
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Unexpected Error: " + error);
    return false;
  }
}
