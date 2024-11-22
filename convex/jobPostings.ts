import { v } from "convex/values";
import { query } from "./_generated/server";

export const listJobPostings = query({
  args: { jobType: v.optional(v.string()), location: v.optional(v.string()) },
  handler: async (ctx, { jobType, location }) => {
    let query: any = ctx.db.query("jobPostings");
    if (location && jobType) {
      query = query.withIndex("by_location_job_type", (q) =>
        q.eq("addressRegion", location).eq("employmentSubType", jobType)
      );
    } else {
      if (location) {
        query = query.withIndex("by_location", (q) =>
          q.eq("addressRegion", location)
        );
      }
      if (jobType) {
        query = query.withIndex("by_job_type", (q) =>
          q.eq("employmentSubType", jobType)
        );
      }
    }
    return await query.collect();
  },
});

export const getSingleJobPosting = query({
  args: { jobPostingId: v.id("jobPostings") },
  handler: async (ctx, { jobPostingId }) => {
    return await ctx.db.get(jobPostingId);
  },
});
