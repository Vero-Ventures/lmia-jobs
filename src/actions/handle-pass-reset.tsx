"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { authClient } from "@/lib/auth-client";
import { randomBytes } from "crypto";

export async function handlePasswordReset(email: string) {
  try {
    // Check if the user was using a temporary password to activate the account.
    const resetUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((res) => res[0]);

    if (resetUser) {
      // Create a reset code and save it to the database.
      const resetCode = randomBytes(8)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "");
      await db
        .update(user)
        .set({ resetCode: resetCode })
        .where(eq(user.id, resetUser.id));

      await authClient.forgetPassword({
        email: resetUser.email,
        redirectTo: "/reset-password",
      });
    }

    return;
  } catch {
    return;
  }
}
