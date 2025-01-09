"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { authClient } from "@/lib/auth-client";
import { randomBytes } from "crypto";
import { handlePasswordReset } from "./handle-pass-reset";

export async function handleLogin(
  email: string,
  password: string
): Promise<string> {
  try {
    await authClient.signIn.email({
      email,
      password,
    });

    // Check if the user was using a temporary password to activate the account.
    const loggedInUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((res) => res[0]);

    if (
      loggedInUser.temporaryPasssword &&
      loggedInUser.temporaryPasssword === password
    ) {
      // If the account is not activated, send a password reset email.
      if (!loggedInUser.activated) {
        handlePasswordReset(loggedInUser.email);
      }

      // Set the user as activated and no longer newly created.
      await db
        .update(user)
        .set({ activated: true, newlyCreated: false })
        .where(eq(user.id, loggedInUser.id));

      return "reset";
    } else {
      return "success";
    }
  } catch {
    return "error";
  }
}
