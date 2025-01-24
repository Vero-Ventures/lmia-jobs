"use server";

import { authClient, resetPassword } from "@/lib/auth-client";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateEmail(
  userId: string,
  newEmail: string
): Promise<string> {
  try {
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .then((res) => res[0]);

    if (currentUser) {
      let failedUpdate = "";
      await authClient.signUp.email(
        {
          email: newEmail,
          password: "TestPass123",
          name: newEmail,
        },
        {
          onError: (ctx) => {
            if (ctx.error.message === "User already exists") {
              failedUpdate = "existing email";
            } else {
              failedUpdate = "error";
            }
          },
        }
      );

      if (failedUpdate !== "") {
        return failedUpdate;
      } else {
        await db
          .update(user)
          .set({ email: newEmail, emailVerified: false })
          .where(eq(user.id, userId));
      }
    }

    return "succcess";
  } catch (error) {
    console.error(error);
    return "error";
  }
}

export async function updatePassword(
  newPassword: string,
  confirmPassword: string
): Promise<string> {
  try {
    const alphaOnly = /^[a-zA-Z]+$/;
    if (newPassword !== confirmPassword) {
      return "not matching";
    } else if (newPassword.length < 8) {
      return "short password";
    } else if (alphaOnly.test(newPassword)) {
      return "weak password";
    }

    let failedUpdate = "";

    await resetPassword(
      {
        newPassword,
      },
      {
        onError: () => {
          failedUpdate = "error";
        },
      }
    );

    if (failedUpdate !== "") {
      return failedUpdate;
    }

    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
