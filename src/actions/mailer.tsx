"use server";

import { db } from "@/db";
import { jobPosting, userMailing, type JobPosting } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Resend } from "resend";
import FormData from "form-data";
// @ts-expect-error - Module imports and calls fileContent without issue, but reads as error in IDE due to "." in the name.
import Mailgun from "mailgun.js";
import {
  inviteEmail_1,
  inviteEmail_2,
  inviteEmail_3,
  inviteEmail_4,
  inviteEmail_5,
  inviteEmail_6,
  inviteEmail_7,
  inviteEmail_8,
  inviteEmail_9,
  inviteEmail_10,
} from "@/components/emails/invite-emails";

const emailTemplates = [
  inviteEmail_1,
  inviteEmail_2,
  inviteEmail_3,
  inviteEmail_4,
  inviteEmail_5,
  inviteEmail_6,
  inviteEmail_7,
  inviteEmail_8,
  inviteEmail_9,
  inviteEmail_10,
];

const resend = new Resend(process.env.RESEND_KEY);

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
      // await db
      //   .update(userMailing)
      //   .set({ newlyCreated: false })
      //   .where(eq(userMailing.id, newestUser.id));

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

      // Get the current mailer template number and read its content.
      const inviteTemplate = Number(process.env.INVITE_TEMPLATE_NUM!);

      const emailContent = emailTemplates[inviteTemplate];

      // Call Mailgun handler to send the invite email.
      sendInviteEmail(
        emailContent,
        email,
        mailerId,
        expiredDate.toDateString(),
        topPostNames,
        totalPosts
      );

      // Determine and set the next mailer template number.
      const nextTemplate = inviteTemplate + 1 < 11 ? inviteTemplate + 1 : 1;

      process.env.INVITE_TEMPLATE = nextTemplate.toString();
    }
    return;
  } catch (error) {
    console.error("Mailing process failed: " + error);
    return;
  }
}

// Takes: The email content, the email address, the mailer Id, the expiry date,
//        The User top 3 post names, and the total number of posts.
export async function sendInviteEmail(
  emailContent: string,
  emailAddress: string,
  _userId: number,
  _expiredDate: string,
  _postNames: string[],
  _totalPosts: number
) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_KEY,
  });

  console.log(emailContent);
  console.log(emailAddress);

  try {
    const result = await mg.messages.create("allopportunities.ca", {
      from: `Join AllOpportunities <JobBank@${process.env.MAILING_DOMAIN}>`,
      to: `Invite <${emailAddress}>`,
      subject: "Hello Braden Rogers",
      text: emailContent,
    });

    console.log(result);
  } catch (error) {
    console.log("Error On Invite Email: " + error);
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
    from: `Opportunities <JobBank${process.env.MAILING_DOMAIN}>`,
    to: `Opportunities <JobBank${process.env.MAILING_DOMAIN}>`,
    subject: `Contact Us: ${subject}, From: ${email}`,
    text: body,
  });
}
