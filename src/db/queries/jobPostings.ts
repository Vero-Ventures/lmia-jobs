import type { EmploymentType, JobBoard, Province } from "@/app/lib/constants";
import { db } from "@/db";
import { jobBoardPosting, jobPosting } from "@/db/schema";
import { eq, and, gt, type SQL, ilike, desc } from "drizzle-orm";

// Gets all job postings from the database.
// Takes: A JobBoard Enum value, the title of the job posting,
//        The province of the job posting, and the employment type of the job posting.
// Returns: An array of job postings.
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

  // Gets relevant job postings from the database.
  // Valid for the job board, shown, payment confirmed, and not expired.
  const filters: SQL[] = [
    eq(jobBoardPosting.jobBoard, jobBoard),
    eq(jobPosting.hidden, false),
    eq(jobPosting.paymentConfirmed, true),
    gt(jobPosting.expiresAt, currentDate),
  ];

  // If a specific employment type or province was passed, add it to the filters.
  if (employmentType !== "All") {
    filters.push(eq(jobPosting.employmentType, employmentType));
  }
  if (province !== "All") {
    filters.push(eq(jobPosting.province, province));
  }

  // If a title was passed, add it to the filters using a text-like query.
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

// Takes: A user Id as a string and a nullable string for the title of the job posting.
// Returns: An array of job the users postings.
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

// Takes: The user Id as a string and the Id of the job posting as a number.
// Returns: The specified job posting if it exists.
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

// Takes: The Id of the job posting as a number.
// Returns: An array of job boards that the job posting is posted on.
export async function selectUserSingleJobPostingBoards({ id }: { id: number }) {
  const jobPostingBoards = await db
    .select()
    .from(jobBoardPosting)
    .where(eq(jobBoardPosting.jobPostingId, id));

  const jobBoards: JobBoard[] = [];

  for (const board of jobPostingBoards) {
    jobBoards.push(board.jobBoard);
  }

  return jobBoards;
}

// Takes: The Id of the job posting as a number.
// Returns: The specified job posting if it exists.
export async function selectSingleJobPosting(id: number) {
  return await db
    .select()
    .from(jobPosting)
    .where(eq(jobPosting.id, id))
    .then((res) => res[0]);
}
