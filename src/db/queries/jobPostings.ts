import { and, eq } from "drizzle-orm";
import { db } from "..";
import { jobPostings } from "../schema";

export async function selectAllJobPostings({
  location,
  jobType,
}: {
  jobType?: string;
  location?: string;
}) {
  if (location && jobType) {
    return await db
      .select()
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.addressRegion, location),
          eq(jobPostings.employmentSubType, jobType)
        )
      );
  }
  if (location) {
    return await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.addressRegion, location));
  }
  if (jobType) {
    return await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.employmentSubType, jobType));
  }
  return await db.select().from(jobPostings);
}
