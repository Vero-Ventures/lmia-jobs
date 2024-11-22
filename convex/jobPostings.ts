import { v } from "convex/values";
import { query } from "./_generated/server";

export const listJobPostings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("jobPostings").collect();
  },
});

export const getSingleJobPosting = query({
  args: { jobPostingId: v.id("jobPostings") },
  handler: async (ctx, { jobPostingId }) => {
    return await ctx.db.get(jobPostingId);
  },
});
