"use server";

import { authClient, resetPassword } from "@/lib/auth-client";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// Takes: The user Id and their new email.
// Returns: A string indicating the result of the update.
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
      // Check if the email is already in use and log the result.
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

      // If the email was not found to be in use, update the user email.
      if (failedUpdate !== "") {
        return failedUpdate;
      } else {
        await db
          .update(user)
          .set({ email: newEmail, emailVerified: false })
          .where(eq(user.id, userId));
      }
    }

    // Log any caught errors and return an indication of the result.
    return "succcess";
  } catch (error) {
    console.error(error);
    return "error";
  }
}

// Takes: The new password and a confirmation of the password.
// Returns: A string indicating the result of the update.
export async function updatePassword(
  newPassword: string,
  confirmPassword: string
): Promise<string> {
  try {
    // Create a regex to check if the password is only alpha characters.
    const alphaOnly = /^[a-zA-Z]+$/;
    // Check if the passwords: Match, are long enough, and contain a non-letter character.
    if (newPassword !== confirmPassword) {
      return "not matching";
    } else if (newPassword.length < 8) {
      return "short password";
    } else if (alphaOnly.test(newPassword)) {
      return "weak password";
    }

    let failedUpdate = "";

    // Attempt to reset the password and record the result.
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

    // If the password update failed, return the recorded result.
    if (failedUpdate !== "") {
      return failedUpdate;
    }

    // Log any caught errors and return an indication of the result.
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
