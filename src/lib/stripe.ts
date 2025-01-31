import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function getUrl(path: string) {
  return `${process.env.BETTER_AUTH_URL}${path}`;
}
