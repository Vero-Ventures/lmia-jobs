"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { authClient } from "@/lib/auth-client";
import { handleSendPasswordReset } from "./handle-pass-reset";

export async function handleLogin(
  email: string,
  password: string
): Promise<string> {
  try {
    const result = await authClient.signIn.email({
      email,
      password,
    });

    const loggedInUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((res) => res[0]);

    if (
      loggedInUser &&
      loggedInUser.temporaryPasssword &&
      loggedInUser.temporaryPasssword === password
    ) {
      if (!loggedInUser.activated) {
        handleSendPasswordReset(loggedInUser.email);
      }

      await db
        .update(user)
        .set({ activated: true, newlyCreated: false })
        .where(eq(user.id, loggedInUser.id));

      return "reset";
    } else if (result.error) {
      return "error";
    } else {
      return "success";
    }
  } catch {
    return "error";
  }
}
