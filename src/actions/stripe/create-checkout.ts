"use server";

import { db } from "@/db/index";
import { user, stripeCustomer } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Stripe } from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_CONFIG! === "production"
    ? process.env.PRODUCTION_STRIPE_PRIVATE_KEY!
    : process.env.DEVELOPER_STRIPE_PRIVATE_KEY!
);

const success_url =
  process.env.STRIPE_CONFIG! === "production"
    ? "https://manageopportunities.ca/admin/payment-confirmed"
    : "http://localhost:3000/admin/payment-confirmed";
const cancel_url =
  process.env.STRIPE_CONFIG! === "production"
    ? "https://manageopportunities.ca/admin/dashboard"
    : "http://localhost:3000/admin/dashboard";
export async function createStripeCheckout(
  userEmail: string,
  postBoards: number,
  postTime: number,
  postId: string
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
        payment_intent_data: {
          metadata: {
            boards: postBoards.toString(),
            time: postTime.toString(),
            postId: postId,
          },
        },
        line_items: [
          {
            price_data: {
              currency: "cad",
              product_data: {
                name:
                  "Post on up to " +
                  postBoards +
                  " boards for " +
                  postTime +
                  " months.",
                description:
                  "Create an Opportunties job board posting to appear on up to " +
                  postBoards +
                  " Opportunities job boards for the next " +
                  postTime +
                  " months.",
                metadata: {
                  boards: postBoards,
                  time: postTime,
                  postId: postId,
                },
              },
              unit_amount: postBoards * postTime * 500,
            },
            quantity: 1,
          },
        ],
        success_url: success_url,
        cancel_url: cancel_url,
      });

      if (checkoutSession.url) {
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
