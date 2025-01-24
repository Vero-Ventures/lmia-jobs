import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, and, ilike, inArray } from "drizzle-orm";

export async function selectAllJobPostings({
  jobBoard,
  userId,
  jobTitle,
  location,
  jobType,
}: {
  jobBoard?: string;
  userId?: string;
  jobTitle?: string;
  jobType?: string;
  location?: string;
}) {
  let postings;

  if (userId) {
    postings = await db
      .select()
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.paymentConfirmed, true),
          eq(jobPostings.userId, userId),
          eq(jobPostings.jobTitle, "%" + jobTitle)
        )
      );
  } else {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const filterAccessible = [true, jobBoard === "accessible-job-board"];
    const filterAsylum = [true, jobBoard === "asylum-job-board"];
    const filterIndigenous = [true, jobBoard === "indigenous-job-board"];
    const filterNewcomers = [true, jobBoard === "newcomers-job-board"];
    const filterYouth = [true, jobBoard === "youth-job-board"];

    postings = await db
      .select()
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.paymentConfirmed, true),
          inArray(jobPostings.postDisabled, filterAccessible),
          inArray(jobPostings.postAsylum, filterAsylum),
          inArray(jobPostings.postIndigenous, filterIndigenous),
          inArray(jobPostings.postNewcomers, filterNewcomers),
          inArray(jobPostings.postYouth, filterYouth),
          ilike(jobPostings.region, "%" + location),
          eq(jobPostings.employmentType, "%" + jobType),
          eq(jobPostings.jobTitle, "%" + jobTitle)
        )
      );

    postings = postings!.filter(
      (posting: { expiresAt: string }) =>
        new Date(posting.expiresAt) > currentDate
    );
  }

  return postings;
}
