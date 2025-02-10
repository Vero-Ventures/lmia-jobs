"use server";

import {
  getStripeCustomerId,
  storeStripeCustomerId,
} from "@/db/queries/stripeCustomer";
import { auth } from "@/lib/auth";
import { getUrl, stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createCheckoutSession({
  numJobBoards,
  numMonths,
  return_url = "/dashboard",
}: {
  numJobBoards: number;
  numMonths: number;
  return_url?: string;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }

  const user = data.user;

  // Get the Stripe Customer Id from the database
  let stripeCustomerId = await getStripeCustomerId(user.id);

  // Create a new Stripe customer if the user does not have one
  if (!stripeCustomerId) {
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id, // DO NOT FORGET THIS
      },
    });

    // Store the relation between user and Stripe Id in the database.
    await storeStripeCustomerId(newCustomer.id, user.id);
    stripeCustomerId = newCustomer.id;
  }
  let session;
  try {
    // ALWAYS create a checkout with a stripeCustomerId. They should enforce this.
    session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      success_url: getUrl(
        "/payment-confirmed?stripe_session_id={CHECKOUT_SESSION_ID}"
      ),
      cancel_url: getUrl(return_url),
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `Job post across ${numJobBoards} job boards for the next ${numMonths} months.`,
              description: `Pay for the job posting to appear on the selected Opportunities job boards for the next
            ${numMonths} months.`,
            },
            unit_amount: numJobBoards * numMonths * 500,
          },
          quantity: 1,
        },
      ],
    });
  } catch (error) {
    console.log("Error creating checkout session:", error);
    throw new Error(
      "Failed to create checkout session. Please refresh and try again."
    );
  }

  return redirect(session.url ?? return_url);
}
