"use server";

import { db } from "@/db";
import { userMailing } from "@/db/schema";
// import { eq, and } from "drizzle-orm";

export async function checkInactiveUserAges() {
  try {
    const mailingUsers = await db.select().from(userMailing);

    mailingUsers.forEach(async (mailingUser) => {
      const _createdAge = mailingUser.createdAt.getTime();
      const _now = Date.now();
      const _oneMonth = 31 * 24 * 60 * 60 * 1000;

      // if (createdAge < now - oneMonth) {
      //   await db
      //     .update(userMailing)
      //     .set({ ignore: true })
      //     .where(
      //       and(
      //         eq(userMailing.id, mailingUser.id),
      //         eq(userMailing.activated, false)
      //       )
      //     );

      //   await db
      //     .delete(jobPosting)
      //     .where(eq(jobPosting.email, mailingUser.email));
      // }
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
