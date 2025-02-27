"use server";

import { db } from "@/db";
import { jobPosting, userMailing, type JobPosting } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Resend } from "resend";
import InviteEmail from "@/components/emails/invite";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function mailInvite() {
  try {
    // Get all mailing users that are newly created.
    const newUsersMailing = await db
      .select()
      .from(userMailing)
      .where(
        and(
          eq(userMailing.newlyCreated, true),
          eq(userMailing.activated, false),
          eq(userMailing.optedOut, false),
          eq(userMailing.ignore, false)
        )
      );

    // Get all posts from the admin user, where posts for unregistered users are stored.
    const userPosts = await db
      .select()
      .from(jobPosting)
      .where(eq(jobPosting.userId, process.env.ADMIN_USER_ID!));

    if (newUsersMailing.length > 0) {
      // Order the posts by the date they were created and get the newest user.
      newUsersMailing.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      const newestUser = newUsersMailing[0];

      // Set the selected newest mailing user to be no longer newly created.
      await db
        .update(userMailing)
        .set({ newlyCreated: false })
        .where(eq(userMailing.id, newestUser.id));

      // Send out an invite to the selected newest mailing user.
      await sendInvite(
        newestUser.email,
        newestUser.id,
        newestUser.createdAt,
        userPosts
      );
    }

    return;
  } catch (error) {
    console.error("Mailing process failed: " + error);
    return;
  }
}

// Takes: The user email and mailer Id, the date of the mailing user creation,
//        And all user mailing posts from the admin account.
export async function sendInvite(
  email: string,
  mailerId: number,
  creationDate: Date,
  userPosts: JobPosting[]
) {
  try {
    // Filter to the posts of the current user.
    const userPostings = userPosts.filter((post) => post.email === email);

    if (userPostings.length > 0) {
      // Get the users total number of posts and the first 3 post names (or less).
      const totalPosts = userPostings.length;
      const topPosts = userPostings.slice(0, totalPosts >= 5 ? 3 : totalPosts);
      const topPostNames = topPosts.map((post) => post.title);

      // Create an expiry date as a date string.
      const expiredTimeStamp =
        creationDate.getTime() + 31 * 24 * 60 * 60 * 1000;
      const expiredDate = new Date(expiredTimeStamp);

      // Send out the invite email to the user.
      await resend.emails.send({
        from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
        to: [email],
        subject: "Activate Your New Account",
        react: (
          <InviteEmail
            userId={mailerId}
            expiredDate={expiredDate.toDateString()}
            postNames={topPostNames}
            totalPosts={totalPosts}
          />
        ),
      });
    }
    return;
  } catch (error) {
    console.error("Mailing process failed: " + error);
    return;
  }
}

// Takes: The mailer Id of the user opting out of reminders.
export async function optOutOfReminders(userId: string): Promise<string> {
  try {
    await db
      .update(userMailing)
      .set({ optedOut: true })
      .where(eq(userMailing.id, Number(userId)));

    return "true";
  } catch (error) {
    console.error("Error Setting Opt Out For User: " + error);
    return "error";
  }
}

// Handles sending emails for the contact us page.
// Takes: The users email, the subject of the email, and the body of the email.
export async function sendContactEmail({
  email,
  subject,
  body,
}: {
  email: string;
  subject: string;
  body: string;
}) {
  await resend.emails.send({
    from: email,
    to: `Opportunities <contact@manageopportunities.ca>`,
    subject: `Contact Us: " + ${subject}`,
    text: body,
  });
}
