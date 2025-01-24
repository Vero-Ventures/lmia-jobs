import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, and, ilike, inArray, gt } from "drizzle-orm";

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
          ilike(
            jobPostings.jobTitle,
            "%" + (jobTitle !== undefined ? jobTitle : "")
          )
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
          ilike(
            jobPostings.region,
            "%" + (location !== undefined ? location : "")
          ),
          ilike(
            jobPostings.employmentType,
            "%" + (jobType !== undefined ? jobType : "")
          ),
          ilike(
            jobPostings.jobTitle,
            "%" + (jobTitle !== undefined ? jobTitle : "")
          ),
          gt(jobPostings.expiresAt, currentDate)
        )
      );
  }

  return postings;
}

export async function selectUserJobPostings({userId, jobTitle}: {userId: string; jobTitle?: string}) {
 return await db
      .select()
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.userId, userId),
          eq(jobPostings.jobTitle, jobTitle ?? ""),
        )
      );
}


