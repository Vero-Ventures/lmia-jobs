"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { authClient } from "@/lib/auth-client";

export async function handleSignUp(
  email: string,
  password: string,
  confirmPassword: string
): Promise<string> {
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .then((res) => res[0]);

  if (existingUser) {
    return "existing user";
  } else {
    const alphaOnly = /^[a-zA-Z]+$/;
    if (password !== confirmPassword) {
      return "different passwords";
    } else if (password.length < 8) {
      return "short password";
    } else if (alphaOnly.test(password)) {
      return "weak password";
    } else {
      const result = await authClient.signUp.email({
        email,
        password,
        name: email,
      });
      console.log(result);

      if (
        result.error &&
        result.error.message &&
        result.error.message === "Invalid email"
      ) {
        return "bad email";
      } else if (result.error) {
        return "unknown error";
      } else {
        await db
          .update(user)
          .set({ activated: true, newlyCreated: false })
          .where(eq(user.email, email));
        return "success";
      }
    }
  }
}
