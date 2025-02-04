import type { EmploymentType, JobBoard, Province } from "@/app/lib/constants";
import { db } from "@/db";
import { jobBoardPosting, jobPosting } from "@/db/schema";
import { eq, and, gt, type SQL, ilike, desc } from "drizzle-orm";

export async function selectAllJobPostings({
  jobBoard,
  title,
  province,
  employmentType,
}: {
  jobBoard: JobBoard;
  title: string;
  province: Province | "All";
  employmentType: EmploymentType | "All";
}) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const filters: SQL[] = [
    eq(jobBoardPosting.jobBoard, jobBoard),
    eq(jobPosting.hidden, false),
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
    .where(and(...filters))
    .orderBy(desc(jobBoardPosting.createdAt));
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
