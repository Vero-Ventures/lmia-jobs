import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export type JobPosting = NonNullable<
  FunctionReturnType<typeof api.jobPostings.getSingleJobPosting>
>;
