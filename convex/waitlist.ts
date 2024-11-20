import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const joinWaitlist = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const existingEmail = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existingEmail) {
      return;
    }
    await ctx.db.insert("waitlist", { email });
  },
});
