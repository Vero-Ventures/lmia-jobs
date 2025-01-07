"use server";

import { db } from "@/db";
import { jobPostings, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import type { JobPosting } from "../app/[jobsiteId]/lib/types";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function mailInvitesAndReminders() {
  try {
    // Get all valid new mailer users.
    const newUsers = await db
      .select()
      .from(users)
      .where(eq(users.newlyCreated, true));

    // Gets all valid Inactive users who have previously recived an email.
    // (Have not opted out or had account marked as ignored due to age.)
    const remindUsers = await db
      .select()
      .from(users)
      .where(
        eq(users.newlyCreated, false) &&
          eq(users.activated, false) &&
          eq(users.optedOut, false) &&
          eq(users.ignore, false)
      );

    // Get the user posts for info to be sent as part of the emails.
    const userPosts = await db.select().from(jobPostings);

    // Check if any new users were found for mailing.
    if (newUsers.length > 0) {
      // Set the assosiated users as no longer newly created.
      await db
        .update(users)
        .set({ newlyCreated: false })
        .where(eq(users.newlyCreated, true));

      // Iterate over the new users to send invite emails first.
      newUsers.forEach(async (user) => {
        sendInvitesAndReminders(user.email, userPosts, true);
      });
    }

    // Check if any users were found for reminders.
    if (remindUsers.length > 0) {
      // Iterate over the users to send an reminder email.
      remindUsers.forEach(async (user) => {
        sendInvitesAndReminders(user.email, userPosts, false);
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
  userPosts: JobPosting[],
  isInvite: boolean
) {
  try {
    // Get the posts for the current user by their email.
    const userPostings = userPosts.filter((post) => post.email === email);

    if (userPostings) {
      // Get the total number of posts and the posts to display (based on number of posts).
      const totalPosts = userPostings.length;
      const topPosts = userPostings.slice(0, totalPosts >= 5 ? 3 : totalPosts);

      // Potentially included post data.
      const _topPostNames = topPosts.map((post) => post.jobTitle);
      const _topPostComanies = topPosts.map((post) => post.hiringOrganization);
      const _topPostLocations = topPosts.map(
        (post) => post.addressLocality + ", " + post.addressRegion
      );

      // NOTE: Message should include names of the created posts (select 3 if 5 or more).
      //       Includes the total number of created posts if total is 5 or higher.
      //       Use the account creation timestamp to inform user of when posts will be deleted.
      //       Posts will be deleted after a set time if account is not activated and payment is setup.
      //       Include a link to the account activation page with URL params for user info.
      //       Also includes an opt out link to update the user to no longer recive emails.
      if (isInvite) {
        // Create the email body and send it to the user.
        await resend.emails.send({
          from: "LMIA Jobs <no-reply@lmia.veroventures.com>",
          to: [email],
          subject: "Activate Your New Account",
          text: "Activate Your New Account",
        });
      } else {
        await resend.emails.send({
          from: "LMIA Jobs <no-reply@lmia.veroventures.com>",
          to: [email],
          subject: "Reminder About Your Account",
          text: "Reminder About Your Account",
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

function _createInviteBody(
  postNames: string[],
  postCompanies: string[],
  postLocations: string[],
  totalPosts: number
) {
  try {
    const header = ``;
    const posts = ``;
    if (totalPosts >= 5) {
    } else {
    }
    const optOut = ``;
    const footer = ``;

    const body = `${header}${posts}${optOut}${footer}`;

    return body;
  } catch (err) {
    console.error("Error creating invite email body.");
    console.error(err);
    return;
  }
}

function _createReminderBody(
  postNames: string[],
  postCompanies: string[],
  postLocations: string[],
  totalPosts: number
) {
  try {
    const header = ``;
    const posts = ``;
    if (totalPosts >= 5) {
    } else {
    }
    const optOut = ``;
    const footer = ``;

    const body = `${header}${posts}${optOut}${footer}`;

    return body;
  } catch (err) {
    console.error("Error creating reminder email body.");
    console.error(err);
    return;
  }
}
