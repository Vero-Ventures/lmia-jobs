"use server";

import { db } from "@/db";
import { jobPosting, userMailing, type JobPosting } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Resend } from "resend";
// import InviteEmail from "@/components/emails/invite";
// import ReminderEmail from "@/components/emails/reminder";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function mailInvitesAndReminders() {
  try {
    const newUsersMailing = await db
      .select()
      .from(userMailing)
      .where(
        and(
          eq(userMailing.newlyCreated, true),
          eq(userMailing.activated, false)
        )
      );

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

    for (let i = 0; i < remindUsersMailing.length; i++) {
      console.log("Remind User: " + remindUsersMailing[i].email);
    }

    for (let i = 0; i < newUsersMailing.length; i++) {
      console.log("New User: " + newUsersMailing[i].email);
    }

    const userPosts = await db.select().from(jobPosting);

    if (newUsersMailing.length > 0) {
      await db
        .update(userMailing)
        .set({ newlyCreated: false })
        .where(eq(userMailing.newlyCreated, true));

      newUsersMailing.forEach(async (user) => {
        sendInvitesAndReminders(user.email, user.createdAt, userPosts, true);
      });
    }

    if (remindUsersMailing.length > 0) {
      remindUsersMailing.forEach(async (user) => {
        sendInvitesAndReminders(user.email, user.createdAt, userPosts, false);
      });
    }

    return;
  } catch (error) {
    console.error("Mailing process failed: " + error);
    return;
  }
}

export async function sendInvitesAndReminders(
  email: string,
  creationDate: Date,
  userPosts: JobPosting[],
  _isInvite: boolean
) {
  try {
    const userPostings = userPosts.filter((post) => post.email === email);

    console.log("User Email + Posts: " + email);
    for (let i = 0; i < userPostings.length; i++) {
      console.log("User Post: " + userPostings[i].title);
    }

    if (userPostings.length === 0) {
      const totalPosts = userPostings.length;

      const topPosts = userPostings.slice(0, totalPosts >= 5 ? 3 : totalPosts);
      const topPostNames = topPosts.map((post) => post.title);

      const expiredTimeStamp =
        creationDate.getTime() + 31 * 24 * 60 * 60 * 1000;
      const expiredDate = new Date(expiredTimeStamp);

      console.log("Email: " + email);
      console.log("Total Posts: " + totalPosts);
      console.log("topPostNames: " + topPostNames);
      console.log("Expired Date: " + expiredDate.toDateString());

      // if (isInvite) {
      //   await resend.emails.send({
      //     from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
      //     to: [email],
      //     subject: "Activate Your New Account",
      //     react: (
      //       <InviteEmail
      //         email={email}
      //         expiredDate={expiredDate.toDateString()}
      //         postNames={topPostNames}
      //         totalPosts={totalPosts}
      //       />
      //     ),
      //   });
      // } else {
      //   await resend.emails.send({
      //     from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
      //     to: [email],
      //     subject: "Reminder About Your Account",
      //     react: (
      //       <ReminderEmail
      //         email={email}
      //         expiredDate={expiredDate.toDateString()}
      //         postNames={topPostNames}
      //         totalPosts={totalPosts}
      //       />
      //     ),
      //   });
      // }
    }
    return;
  } catch (error) {
    console.error("Mailing process failed: " + error);
    return;
  }
}

export async function optOutOfReminders(email: string): Promise<string> {
  try {
    await db
      .update(userMailing)
      .set({ optedOut: true })
      .where(eq(userMailing.email, email));

    return "true";
  } catch (error) {
    console.error("Error Setting Opt Out For User: " + error);
    return "error";
  }
}

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
