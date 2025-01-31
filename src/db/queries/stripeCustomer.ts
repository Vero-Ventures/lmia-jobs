import { eq } from "drizzle-orm";
import { db } from "..";
import { stripeCustomer } from "../schema";

export async function getStripeCustomerId(userId: string) {
  const result = await db
    .select()
    .from(stripeCustomer)
    .where(eq(stripeCustomer.userId, userId))
    .then((res) => res[0]);

  if (!result) {
    return null;
  }
  return result.id;
}

export async function storeStripeCustomerId(id: string, userId: string) {
  return await db.insert(stripeCustomer).values({ id, userId });
}
