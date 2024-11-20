import { internalAction, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import WaitListConfirmed from "./emails/waitlist-confirmed";
import { internal } from "./_generated/api";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const joinMailingList = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const existingEmail = await ctx.db
      .query("mailingList")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existingEmail) {
      return;
    }
    await ctx.db.insert("mailingList", { email });
    await ctx.scheduler.runAfter(
      0,
      internal.mailingList.sendWaitingListConfirmedEmail,
      {
        email,
      }
    );
  },
});

export const sendWaitingListConfirmedEmail = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (_ctx, { email }) => {
    await resend.emails.send({
      from: "Job Bank <no-reply@livetimeless.veroventures.com>",
      to: [email],
      subject: "You are on Job Bank's early access list",
      react: <WaitListConfirmed />,
    });
  },
});
