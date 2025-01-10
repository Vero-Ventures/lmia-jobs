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
    const newUsers = await db
      .select()
      .from(user)
      .where(eq(user.newlyCreated, true));

    const remindUsers = await db
      .select()
      .from(user)
      .where(
        eq(user.newlyCreated, false) &&
          eq(user.activated, false) &&
          eq(user.optedOut, false) &&
          eq(user.ignore, false)
      );

    const userPosts = await db.select().from(jobPostings);

    if (newUsers.length > 0) {
      await db
        .update(user)
        .set({ newlyCreated: false })
        .where(eq(user.newlyCreated, true));

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

    if (remindUsers.length > 0) {
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

export async function sendInvitesAndReminders(
  email: string,
  tempPassword: string,
  creationDate: Date,
  userPosts: JobPosting[],
  isInvite: boolean
) {
  try {
    const userPostings = userPosts.filter((post) => post.email === email);

    if (userPostings.length === 0) {
      const totalPosts = userPostings.length;

      const topPosts = userPostings.slice(0, totalPosts >= 5 ? 3 : totalPosts);
      const topPostNames = topPosts.map((post) => post.jobTitle);

      const expiredTimeStamp =
        creationDate.getTime() + 31 * 24 * 60 * 60 * 1000;
      const expiredDate = new Date(expiredTimeStamp);

      if (isInvite) {
        await resend.emails.send({
          from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
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
          from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
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
