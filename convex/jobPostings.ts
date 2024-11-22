import { v } from "convex/values";
import { query } from "./_generated/server";

export const listJobPostings = query({
  args: { jobType: v.optional(v.string()), location: v.optional(v.string()) },
  handler: async (ctx, { jobType, location }) => {
    if (location && jobType) {
      return await ctx.db
        .query("jobPostings")
        .withIndex("by_location_job_type", (q) =>
          q.eq("addressRegion", location).eq("employmentSubType", jobType)
        )
        .collect();
    } else {
      if (location) {
        return await ctx.db
          .query("jobPostings")
          .withIndex("by_location", (q) => q.eq("addressRegion", location))
          .collect();
      }
      if (jobType) {
        return await ctx.db
          .query("jobPostings")
          .withIndex("by_job_type", (q) => q.eq("employmentSubType", jobType))
          .collect();
      }
      return await ctx.db.query("jobPostings").collect();
    }
  },
});

export const getSingleJobPosting = query({
  args: { jobPostingId: v.id("jobPostings") },
  handler: async (ctx, { jobPostingId }) => {
    return await ctx.db.get(jobPostingId);
  },
});
