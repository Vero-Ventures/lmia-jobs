"use server";

import { db } from "@/db";
import { userMailing, jobPosting } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function checkInactiveUserAges() {
  try {
    // Get all users to check for inactive accounts (over a month without activation).
    const mailingUsers = await db.select().from(userMailing);

    mailingUsers.forEach(async (mailingUser) => {
      // Get the date of the mailing users creation and the date of one month ago.
      const createdAge = mailingUser.createdAt.getTime();
      const now = Date.now();
      const oneMonth = 31 * 24 * 60 * 60 * 1000;

      // Check for any users older than one month.
      if (createdAge < now - oneMonth) {
        // Set the user as ignored to prevent future scraping.
        await db
          .update(userMailing)
          .set({ ignore: true })
          .where(
            and(
              eq(userMailing.id, mailingUser.id),
              eq(userMailing.activated, false)
            )
          );

        // Remove all of the users scraped posts from the admin account.
        await db
          .delete(jobPosting)
          .where(eq(jobPosting.email, mailingUser.email));
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
