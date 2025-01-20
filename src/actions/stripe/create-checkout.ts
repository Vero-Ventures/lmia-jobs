"use server";

import { db } from "@/db/index";
import { user, stripeCustomer } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(process.env.DEV_STRIPE_PRIVATE_KEY!);

export async function createStripePurchase(
  userEmail: string,
  postBoards: number,
  postTime: number
): Promise<{ result: boolean; url: string }> {
  try {
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .then((res) => res[0]);

    if (!currentUser) {
      console.error("User Not Found.");
      return { result: false, url: "" };
    }

    const stripeUser = await db
      .select()
      .from(stripeCustomer)
      .where(eq(stripeCustomer.userId, currentUser.id))
      .then((res) => res[0]);

    if (stripeUser) {
      const checkoutSession = await stripe.checkout.sessions.create({
        ui_mode: "hosted",
        customer: stripeUser.stripeId,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "cad",
              product_data: {
                name: "Post on " + postBoards + " for " + postTime + " weeks.",
                description:
                  "Create an Opportunties job board posting to appear on up to " +
                  postBoards +
                  " Opportunities job boards for the next " +
                  postTime +
                  " weeks.",
              },
              unit_amount: postBoards * postTime * 1000,
            },
            quantity: 1,
          },
        ],
        cancel_url: "https://manageopportunities.ca/admin/purchase",
        success_url: "https://manageopportunities.ca/admin/dashboard",
      });

      if (checkoutSession.url) {
        console.log(checkoutSession);
        return { result: true, url: checkoutSession.url };
      } else {
        console.error("Stripe Session Creation Failed.");
        return { result: false, url: "" };
      }
    } else {
      console.error("Stripe User Not Found.");
      return { result: false, url: "" };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { result: false, url: "" };
    } else {
      console.error("Unexpected Error.");
      return { result: false, url: "" };
    }
  }
}
