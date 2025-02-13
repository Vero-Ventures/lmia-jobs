"use server";

import { db } from "@/db";
import { jobPosting, userMailing, type JobPosting } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Resend } from "resend";
import InviteEmail from "@/components/emails/invite";
import ReminderEmail from "@/components/emails/reminder";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function mailInvitesAndReminders() {
  try {
    // Get all mailing users that are newly created.
    const newUsersMailing = await db
      .select()
      .from(userMailing)
      .where(
        and(
          eq(userMailing.newlyCreated, true),
          eq(userMailing.activated, false),
          
        )
      );

    // Get any remaining users who are not opted out or ignored due to age.
    const remindUsersMailing = await db
      .select()
      .from(userMailing)
      .where(
        and(
          eq(userMailing.newlyCreated, false),
          eq(userMailing.activated, false),
          eq(userMailing.optedOut, false),
          eq(userMailing.ignore, false),
         
        )
      );

    // Get all posts from the admin user, where posts for unregistered users are stored.
    const userPosts = await db
      .select()
      .from(jobPosting)
      .where(eq(jobPosting.userId, process.env.ADMIN_USER_ID!));

    if (newUsersMailing.length > 0) {
      // Set all newly created users as no longer newly created.
      await db
        .update(userMailing)
        .set({ newlyCreated: false })
        .where(eq(userMailing.newlyCreated, true));

      // Send out an invite with the users top posts and expiry date.
      newUsersMailing.forEach(async (user) => {
        await sendInvitesAndReminders(
          user.email,
          user.id,
          user.createdAt,
          userPosts,
          true
        );
      });
    }

    // Send out reminders to users who have not opted out or been ignored.
    if (remindUsersMailing.length > 0) {
      remindUsersMailing.forEach(async (user) => {
        await sendInvitesAndReminders(
          user.email,
          user.id,
          user.createdAt,
          userPosts,
          false
        );
      });
    }

    return;
  } catch (error) {
    console.error("Mailing process failed: " + error);
    return;
  }
}

// Takes: The users email and mailer Id, the date of the mailing users creation,
//        All user posts from the admin account, and if the email is an invite or reminder.
export async function sendInvitesAndReminders(
  email: string,
  mailerId: number,
  creationDate: Date,
  userPosts: JobPosting[],
  isInvite: boolean
) {
  try {
    // Filter to the posts of the current user.
    const userPostings = userPosts.filter((post) => post.email === email);

    if (userPostings.length > 0) {
      // Get the users total number of posts and the first 3 post names (or less).
      const totalPosts = userPostings.length;

      const topPosts = userPostings.slice(0, totalPosts >= 5 ? 3 : totalPosts);
      const topPostNames = topPosts.map((post) => post.title);

      // Convert the expiry date to a date string.
      const expiredTimeStamp =
        creationDate.getTime() + 31 * 24 * 60 * 60 * 1000;
      const expiredDate = new Date(expiredTimeStamp);

      // Send out the appropriate email based on if it should be an invite or reminder.
      if (isInvite) {
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
      } else {
        await resend.emails.send({
          from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
          to: [email],
          subject: "Reminder About Your Account",
          react: (
            <ReminderEmail
              userId={mailerId}
              expiredDate={expiredDate.toDateString()}
              postNames={topPostNames}
              totalPosts={totalPosts}
            />
          ),
        });
      }
    } else {
      return;
    }
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
  throw "test";
  await resend.emails.send({
    from: email,
    to: `Opportunities <contact@manageopportunities.ca>`,
    subject: `Contact Us: " + ${subject}`,
    text: body,
  });
}
