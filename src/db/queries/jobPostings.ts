import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, and, gt, type SQL, ilike } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

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

  const jobBoardMap: Record<string, PgColumn> = {
    indigenous: jobPostings.postIndigenous,
    newcomers: jobPostings.postNewcomers,
    accessible: jobPostings.postDisabled,
    youth: jobPostings.postYouth,
    asylum: jobPostings.postAsylum,
  };

  const filters: SQL[] = [
    eq(jobPostings.paymentConfirmed, true),
    gt(jobPostings.expiresAt, currentDate),
    eq(jobBoardMap[jobBoard], true),
  ];

  if (jobType !== "All") {
    filters.push(eq(jobPostings.employmentType, jobType));
  }

  if (location !== "All") {
    filters.push(eq(jobPostings.region, location));
  }

  if (jobTitle) {
    filters.push(ilike(jobPostings.jobTitle, "%" + jobTitle));
  }

  return await db
    .select()
    .from(jobPostings)
    .where(and(...filters));
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
