import { query } from "./_generated/server";

export const listJobPostings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("jobPostings").collect();
  },
});
