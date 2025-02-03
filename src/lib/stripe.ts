import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function getUrl(path: string) {
  return `${process.env.NODE_ENV === "production" ? "https://manageopportunities.ca" : "http://localhost:3000"}${path}`;
}
