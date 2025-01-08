"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function optOutOfReminders(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (user) {
    throw new Error("User with that email could not be found.");
  }

  await db.update(users).set({ optedOut: true }).where(eq(users.email, email));

  return "true";
}
