import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
  },
});
