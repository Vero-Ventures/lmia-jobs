"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authClient } from "@/lib/auth-client";

const signUpErrors: Record<string, string> = {
  "bad email": "The entered email is invalid.",
  "existing user": "An account with that email already exists.",
  "different passwords": "Your passwords must match each other.",
  "short password": "Your password must be 8 characters or longer.",
  "weak password": "Your password must contain a number or symbol.",
  error: "An error occurred while creating your account.",
};

export async function handleSignUp(
  email: string,
  password: string,
  confirmPassword: string
): Promise<string> {
  try {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((res) => res[0]);

    if (existingUser) {
      return signUpErrors["existing user"];
    } else {
      const alphaOnly = /^[a-zA-Z]+$/;
      if (password !== confirmPassword) {
        return signUpErrors["different passwords"];
      } else if (password.length < 8) {
        return signUpErrors["short password"];
      } else if (alphaOnly.test(password)) {
        return signUpErrors["weak password"];
      } else {
        const result = await authClient.signUp.email({
          email,
          password,
          name: email,
        });

        if (
          result.error &&
          result.error.message &&
          result.error.message === "Invalid email"
        ) {
          return signUpErrors["bad email"];
        } else if (result.error) {
          return signUpErrors["error"];
        } else {
          await db
            .update(user)
            .set({ activated: true, newlyCreated: false })
            .where(eq(user.email, email));
          return "success";
        }
      }
    }
  } catch {
    return "error";
  }
}
