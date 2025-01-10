"use server";

import { db } from "@/db";
import { jobPostings, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkInactiveUserAges() {
  try {
    const postedUsers = await db
      .select()
      .from(user)
      .where(eq(user.activated, false) && eq(user.ignore, false));

    postedUsers.forEach(async (postedUser) => {
      const now = Date.now();
      const createdAge = postedUser.createdAt.getTime();
      const timestampMillis = now - 31 * 24 * 60 * 60 * 1000;

      if (createdAge < timestampMillis) {
        await db
          .update(user)
          .set({ ignore: true })
          .where(eq(user.id, postedUser.id));

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
