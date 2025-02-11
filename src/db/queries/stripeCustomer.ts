import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stripeCustomer } from "@/db/schema";

// Takes: User Id as a string.
// Returns: Stripe Customer Id as a string or null.
export async function getStripeCustomerId(
  userId: string
): Promise<string | null> {
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

// Takes: Stripe Customer Id and User Id as strings.
// Returns: The result of the insert Stripe Customer query.
export async function storeStripeCustomerId(id: string, userId: string) {
  return await db.insert(stripeCustomer).values({ id, userId });
}
