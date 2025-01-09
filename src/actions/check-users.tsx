"use server";

import { db } from "@/db";
import { jobPostings, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkInactiveUserAges() {
  try {
    // Get all inactive users who have not been marked as ignored.
    const postedUsers = await db
      .select()
      .from(user)
      .where(eq(user.activated, false) && eq(user.ignore, false));

    // Check each user to see if the account is over a month old.
    postedUsers.forEach(async (postedUser) => {
      // Get the current date and when the account was created as milliseconds.
      const now = Date.now();
      const createdAge = postedUser.createdAt.getTime();

      // Calculate 31 days ago in milliseconds and check if the account is over 31 days old.
      const timestampMillis = now - 31 * 24 * 60 * 60 * 1000;
      if (createdAge < timestampMillis) {
        // Inactive accounts over a month old are set to ignored.
        await db
          .update(user)
          .set({ ignore: true })
          .where(eq(user.id, postedUser.id));

        // Delete all job postings associated with the user.
        await db.delete(jobPostings).where(eq(jobPostings.email, user.email));
      }
    });

    return;
  } catch (err) {
    console.error(
      "Error Setting Inactive Users As Ignored And Removing Their Job Postings"
    );
    console.error(err);
    return;
  }
}
