import { db } from "@/db";
import { jobBoardPosting, jobPosting } from "@/db/schema";
import { eq, and, gt, type SQL, ilike } from "drizzle-orm";

export async function selectAllJobPostings({
  jobBoardId,
  title,
  province,
  employmentType,
}: {
  jobBoardId: number;
  title: string;
  province: string;
  employmentType: string;
}) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const filters: SQL[] = [
    eq(jobBoardPosting.jobBoardId, jobBoardId),
    eq(jobPosting.paymentConfirmed, true),
    gt(jobPosting.expiresAt, currentDate),
  ];

  if (employmentType !== "All") {
    filters.push(eq(jobPosting.employmentType, employmentType));
  }

  if (province !== "All") {
    filters.push(eq(jobPosting.province, province));
  }

  if (title) {
    filters.push(ilike(jobPosting.title, "%" + title));
  }

  return await db
    .select()
    .from(jobBoardPosting)
    .innerJoin(jobPosting, eq(jobBoardPosting.jobPostingId, jobPosting.id))
    .where(and(...filters));
}

export async function selectUserJobPostings({
  userId,
  title,
}: {
  userId: string;
  title?: string;
}) {
  const filters: SQL[] = [eq(jobPosting.userId, userId)];

  if (title) {
    filters.push(eq(jobPosting.title, title));
  }
  return await db
    .select()
    .from(jobPosting)
    .where(and(...filters));
}

export async function selectUserSingleJobPosting({
  userId,
  id,
}: {
  userId: string;
  id: number;
}) {
  return await db
    .select()
    .from(jobPosting)
    .where(and(eq(jobPosting.userId, userId), eq(jobPosting.id, id)))
    .then((res) => res[0]);
}

export async function selectSingleJobPosting(id: number) {
  return await db
    .select()
    .from(jobPosting)
    .where(eq(jobPosting.id, id))
    .then((res) => res[0]);
}
