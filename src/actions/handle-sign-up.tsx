"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// import { authClient } from "@/lib/auth-client";

export async function handleSignUp(
  email: string,
  password: string,
  confirmPassword: string
): Promise<string> {
  // Check if the user account already exists.
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .then((res) => res[0]);

  // Check if the user already exists for handing the error message.
  if (existingUser) {
    return "existing user";
  } else {
    // Check the passwords match and are strong enough.
    const alphaOnly = /^[a-zA-Z]+$/;
    if (password !== confirmPassword) {
      return "different passwords";
    } else if (password.length < 8) {
      return "short password";
    } else if (alphaOnly.test(password)) {
      return "weak password";
    } else {
      // Try the sign up process and return an appropriate result string.
      try {
        // await authClient.signUp.email({
        //   email,
        //   password,
        //   name: email,
        // });
        return "success";
      } catch {
        return "unknown error";
      }
    }
  }
}
