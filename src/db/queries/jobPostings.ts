import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, and, ilike, inArray, gt } from "drizzle-orm";

export async function selectAllJobPostings({
  jobBoard,
  jobTitle,
  location,
  jobType,
}: {
  jobBoard: string;
  jobTitle: string;
  jobType: string;
  location: string;
}) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return await db
    .select()
    .from(jobPostings)
    .where(
      and(
        eq(jobPostings.paymentConfirmed, true),
        inArray(jobPostings.postDisabled, [
          true,
          jobBoard === "accessible-job-board",
        ]),
        inArray(jobPostings.postAsylum, [
          true,
          jobBoard === "asylum-job-board",
        ]),
        inArray(jobPostings.postIndigenous, [
          true,
          jobBoard === "indigenous-job-board",
        ]),
        inArray(jobPostings.postNewcomers, [
          true,
          jobBoard === "newcomers-job-board",
        ]),
        inArray(jobPostings.postYouth, [true, jobBoard === "youth-job-board"]),
        ilike(jobPostings.region, "%" + location),
        ilike(jobPostings.employmentType, "%" + jobType),
        ilike(jobPostings.jobTitle, "%" + jobTitle),
        gt(jobPostings.expiresAt, currentDate)
      )
    );
}

export async function selectUserJobPostings({
  userId,
  jobTitle,
}: {
  userId: string;
  jobTitle?: string;
}) {
  if (jobTitle) {
    return await db
      .select()
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.userId, userId),
          eq(jobPostings.jobTitle, jobTitle ?? "")
        )
      );
  }
  return await db
    .select()
    .from(jobPostings)
    .where(eq(jobPostings.userId, userId));
}

export async function selectUserSingleJobPosting({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  return await db
    .select()
    .from(jobPostings)
    .where(and(eq(jobPostings.userId, userId), eq(jobPostings.id, id)))
    .then((res) => res[0]);
}

export async function selectSingleJobPosting(id: string) {
  return await db
    .select()
    .from(jobPostings)
    .where(eq(jobPostings.id, id))
    .then((res) => res[0]);
}
