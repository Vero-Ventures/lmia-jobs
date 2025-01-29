"use server";

import { db } from "@/db";
import { jobPosting, user, userMailing, type JobPosting } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { Resend } from "resend";
import InviteEmail from "@/components/emails/invite";
import ReminderEmail from "@/components/emails/reminder";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function mailInvitesAndReminders() {
  try {
    const newUsersMailing = await db
      .select()
      .from(userMailing)
      .where(eq(userMailing.newlyCreated, true));

    const remindUsersMailing = await db
      .select()
      .from(userMailing)
      .where(
        and(
          eq(userMailing.newlyCreated, false),
          eq(userMailing.activated, false),
          eq(userMailing.optedOut, false),
          eq(userMailing.ignore, false)
        )
      );

    const userPosts = await db.select().from(jobPosting);

    if (newUsersMailing.length > 0) {
      await db
        .update(userMailing)
        .set({ newlyCreated: false })
        .where(eq(userMailing.newlyCreated, true));

      const newUserIds = newUsersMailing.map((user) => user.userId);

      const newUsers = await db
        .select()
        .from(user)
        .where(inArray(user.id, newUserIds));

      newUsers.forEach(async (user) => {
        sendInvitesAndReminders(user.email, user.createdAt, userPosts, true);
      });
    }

    if (remindUsersMailing.length > 0) {
      const remindUserIds = newUsersMailing.map((user) => user.userId);

      const remindUsers = await db
        .select()
        .from(user)
        .where(inArray(user.id, remindUserIds));

      remindUsers.forEach(async (user) => {
        sendInvitesAndReminders(user.email, user.createdAt, userPosts, false);
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
  creationDate: Date,
  userPosts: JobPosting[],
  isInvite: boolean
) {
  try {
    const userPostings = userPosts.filter((post) => post.email === email);

    if (userPostings.length === 0) {
      const totalPosts = userPostings.length;

      const topPosts = userPostings.slice(0, totalPosts >= 5 ? 3 : totalPosts);
      const topPostNames = topPosts.map((post) => post.title);

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

export async function optOutOfReminders(email: string): Promise<string> {
  const optedOutUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .then((res) => res[0]);

  if (!optedOutUser) {
    throw new Error("User with that email could not be found.");
  }

  await db
    .update(userMailing)
    .set({ optedOut: true })
    .where(eq(userMailing.userId, optedOutUser.id));

  return "true";
}

export async function sendContactEmail(
  email: string,
  subject: string,
  body: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
      to: `${process.env.RESEND_ADDRESS}`,
      subject: "Contact Us: " + subject + " - From: " + email,
      text: body,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
