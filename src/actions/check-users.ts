"use server";

import { db } from "@/db";
import { jobPosting, user, userMailing } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function checkInactiveUserAges() {
  try {
    const postedUsers = await db.select().from(user);

    postedUsers.forEach(async (postedUser) => {
      const now = Date.now();
      const createdAge = postedUser.createdAt.getTime();
      const timestampMillis = now - 31 * 24 * 60 * 60 * 1000;

      if (createdAge < timestampMillis) {
        await db
          .update(userMailing)
          .set({ ignore: true })
          .where(
            and(
              eq(userMailing.userId, user.id),
              eq(userMailing.activated, false)
            )
          );

        await db.delete(jobPosting).where(eq(jobPosting.userId, user.id));
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
