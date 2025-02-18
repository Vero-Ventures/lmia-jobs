"use server";

import {
  getStripeCustomerId,
  storeStripeCustomerId,
} from "@/db/queries/stripeCustomer";
import { auth } from "@/lib/auth";
import { getUrl, stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Takes: The number of job boards posted to and the number of months posted.
//        The return URL is optional and defaults to the dashboard.
export async function createCheckoutSession({
  numJobBoards,
  numMonths,
  jobPostingId,
  return_url = "/dashboard",
}: {
  numJobBoards: number;
  numMonths: number;
  jobPostingId: number;
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

  // Define variable to store the session with the url to redirect to for checkout.
  let session;
  try {
    // ALWAYS create a checkout with a Stripe Customer Id. They should enforce this.
    // Pricing is set in cents so 400 = $4.00.
    session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      success_url: getUrl(
        "/payment-confirmed?stripe_session_id={CHECKOUT_SESSION_ID}"
      ),
      cancel_url: getUrl(return_url),
      mode: "payment",
      payment_intent_data: {
        metadata: {
          numJobBoards,
          numMonths,
          jobPostingId,
          userId: user.id,
        },
      },
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `Job post across ${numJobBoards} job boards for the next ${numMonths} months.`,
              description: `Pay for the job posting to appear on the selected Opportunities job boards for the next
            ${numMonths} months.`,
            },
            unit_amount: numJobBoards * numMonths * 400,
          },
          quantity: 1,
        },
      ],
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(
      "Failed to create checkout session. Please refresh and try again."
    );
  }

  // Redirect to the checkout page or the return URL if it cannot be found.
  return redirect(session.url ?? return_url);
}
