"use server";

import { db } from "@/db";
import { jobPostings, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import InviteEmail from "@/components/emails/invite";
import ReminderEmail from "@/components/emails/reminder";
import type { JobPosting } from "@/app/[jobsiteId]/lib/types";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function mailInvitesAndReminders() {
  try {
    // Get all valid new mailer users.
    const newUsers = await db
      .select()
      .from(user)
      .where(eq(user.newlyCreated, true));

    // Gets all valid Inactive users who have previously recived an email.
    // (Have not opted out or had account marked as ignored due to age.)
    const remindUsers = await db
      .select()
      .from(user)
      .where(
        eq(user.newlyCreated, false) &&
          eq(user.activated, false) &&
          eq(user.optedOut, false) &&
          eq(user.ignore, false)
      );

    // Get the user posts for info to be sent as part of the emails.
    const userPosts = await db.select().from(jobPostings);

    // Check if any new users were found for mailing.
    if (newUsers.length > 0) {
      // Set the assosiated users as no longer newly created.
      await db
        .update(user)
        .set({ newlyCreated: false })
        .where(eq(user.newlyCreated, true));

      // Iterate over the new users to send invite emails first.
      newUsers.forEach(async (user) => {
        sendInvitesAndReminders(
          user.email,
          user.temporaryPasssword!,
          user.createdAt,
          userPosts,
          true
        );
      });
    }

    // Check if any users were found for reminders.
    if (remindUsers.length > 0) {
      // Iterate over the users to send an reminder email.
      remindUsers.forEach(async (user) => {
        sendInvitesAndReminders(
          user.email,
          user.temporaryPasssword!,
          user.createdAt,
          userPosts,
          false
        );
      });
    }

    return;
  } catch (err) {
    console.error("Mailing process failed.");
    console.error(err);
    return;
  }
}

async function sendInvitesAndReminders(
  email: string,
  tempPassword: string,
  creationDate: Date,
  userPosts: JobPosting[],
  isInvite: boolean
) {
  try {
    // Get the posts for the current user by their email.
    const userPostings = userPosts.filter((post) => post.email === email);

    console.log(userPostings);
    if (userPostings.length === 0) {
      // Get the total number of posts and the posts to display (based on number of posts).
      const totalPosts = userPostings.length;
      const topPosts = userPostings.slice(0, totalPosts >= 5 ? 3 : totalPosts);

      // Potentially included post data.
      const topPostNames = topPosts.map((post) => post.jobTitle);

      // Get one month from the creation date.
      const expiredTimeStamp =
        creationDate.getTime() + 31 * 24 * 60 * 60 * 1000;
      const expiredDate = new Date(expiredTimeStamp);

      if (isInvite) {
        await resend.emails.send({
          from: `Opportunities <no-reply@lmia.veroventures.com>`,
          to: [email],
          subject: "Activate Your New Account",
          react: (
            <InviteEmail
              email={email}
              tempPassword={tempPassword}
              expiredDate={expiredDate.toDateString()}
              postNames={topPostNames}
              totalPosts={totalPosts}
            />
          ),
        });
      } else {
        await resend.emails.send({
          from: `Opportunities <no-reply@lmia.veroventures.com>`,
          to: [email],
          subject: "Reminder About Your Account",
          react: (
            <ReminderEmail
              email={email}
              tempPassword={tempPassword}
              expiredDate={expiredDate.toDateString()}
              postNames={topPostNames}
              totalPosts={totalPosts}
            />
          ),
        });
      }
    }
    return;
  } catch (err) {
    console.error("Mailing process failed.");
    console.error(err);
    return;
  }
}
