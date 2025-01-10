"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { authClient } from "@/lib/auth-client";
import { randomBytes } from "crypto";

export async function handleSendPasswordReset(email: string) {
  try {
    const resetUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((res) => res[0]);

    if (resetUser) {
      let resetCode = "";
      while (resetCode.length < 8) {
        resetCode += randomBytes(8)
          .toString("base64")
          .replace(/[^a-zA-Z0-9]/g, "");
      }
      resetCode = resetCode.slice(0, 8);

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

export async function handleResetPassword(
  resetPasscode: string,
  password: string,
  confirmPassword: string
): Promise<string> {
  const resetUser = await db
    .select()
    .from(user)
    .where(eq(user.resetCode, resetPasscode))
    .then((res) => res[0]);

  if (resetUser) {
    const alphaOnly = /^[a-zA-Z]+$/;
    if (password !== confirmPassword) {
      return "different passwords";
    } else if (password.length < 8) {
      return "short password";
    } else if (alphaOnly.test(password)) {
      return "weak password";
    } else {
      const result = await authClient.resetPassword({
        newPassword: password,
      });

      if (result.error) {
        return "error";
      }

      await db
        .update(user)
        .set({ resetCode: null })
        .where(eq(user.id, resetUser.id));

      return "success";
    }
  } else {
    return "error";
  }
}
