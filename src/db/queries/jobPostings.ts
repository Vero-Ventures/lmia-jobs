import { and, eq } from "drizzle-orm";
import { db } from "..";
import { jobPostings } from "../schema";

export async function selectAllJobPostings({
  location,
  jobType,
  query,
  email,
}: {
  jobType?: string;
  location?: string;
  query?: string;
  email?: string;
}) {
  let postings;
  if (email) {
    postings = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.email, email));
  } else {
    if (location && jobType) {
      postings = await db
        .select()
        .from(jobPostings)
        .where(
          and(
            eq(jobPostings.addressRegion, location),
            eq(jobPostings.employmentType, jobType)
          )
        );
    } else if (location) {
      postings = await db
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.addressRegion, location));
    } else if (jobType) {
      postings = await db
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.employmentType, jobType));
    } else {
      postings = await db.select().from(jobPostings);
    }
  }

  if (query) {
    postings = postings!.filter((posting) =>
      posting.jobTitle.toLowerCase().includes(query.toLowerCase())
    );
  }
  return postings;
}
