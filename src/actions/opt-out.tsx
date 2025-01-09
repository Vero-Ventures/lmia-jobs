"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function optOutOfReminders(email: string): Promise<string> {
  const optedOutUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .then((res) => res[0]);

  if (!optedOutUser) {
    throw new Error("User with that email could not be found.");
  }

  await db.update(user).set({ optedOut: true }).where(eq(user.email, email));

  return "true";
}
