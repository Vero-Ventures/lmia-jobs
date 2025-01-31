import { eq } from "drizzle-orm";
import { db } from "..";
import { stripeCustomer } from "../schema";

export async function getStripeCustomerId(userId: string) {
  return await db
    .select()
    .from(stripeCustomer)
    .where(eq(stripeCustomer.userId, userId))
    .then((res) => res[0]);
}

export async function storeStripeCustomerId(id: string, userId: string) {
  return await db.insert(stripeCustomer).values({ id, userId });
}
