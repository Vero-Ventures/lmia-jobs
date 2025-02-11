"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { jobBoardPosting, jobPosting } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type {
  CreateJobPosting,
  EditJobPosting,
} from "@/app/lib/job-postings/schema";
import type { JobBoard } from "@/app/lib/constants";

// Takes: The Create Job Posting form data, and an array of selected job boards.
// Returns:
export async function createJobPost(
  formData: CreateJobPosting,
  selectedJobBoards: JobBoard[]
): Promise<number | null> {
  try {
    // Redirect if no sesion is found.
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return redirect("/sign-in");

    // Get months to post from the form data and set an expiryDate.
    // Expires in 12 months or the number of months to post, whichever is greater.
    const { monthsToPost, ...rest } = formData;

    const expiryDate = new Date();
    expiryDate.setMonth(new Date().getMonth() + Math.max(12, monthsToPost));

    // Format the form data, and add the missing database fields.
    const postData = {
      ...rest,
      userId: session.user.id,
      vacancies: !formData.vacancies ? null : Number(formData.vacancies),
      minWorkHours: String(formData.minWorkHours),
      maxWorkHours: !formData.maxWorkHours
        ? null
        : String(formData.maxWorkHours),
      minPayValue: String(formData.minPayValue),
      maxPayValue: !formData.maxPayValue ? null : String(formData.maxPayValue),
      expiresAt: expiryDate,
      paymentConfirmed: false,
      hidden: false,
    };

    // Insert the job posting into the database and return the result.
    // Gets the Id and use it to create the related job board postings.
    const { id: jobPostingId } = await db
      .insert(jobPosting)
      .values(postData)
      .returning({ id: jobPosting.id })
      .then((res) => res[0]);

    await createJobBoardPostings({ id: jobPostingId, selectedJobBoards });

    return jobPostingId;
  } catch (error) {
    console.error("Error creating post: " + error);
    return null;
  }
}

export async function createJobBoardPostings({
  id,
  selectedJobBoards,
}: {
  id: number;
  selectedJobBoards: JobBoard[];
}) {
  selectedJobBoards.push("all");
  await Promise.all(
    selectedJobBoards.map(async (jobBoard) => {
      return await db.insert(jobBoardPosting).values({
        jobBoard,
        jobPostingId: id,
      });
    })
  );
}

export async function removeJobBoardPostings(id: number) {
  await db.delete(jobBoardPosting).where(eq(jobBoardPosting.jobPostingId, id));
}

export async function updateJobBoardPostings({
  id,
  selectedJobBoards,
  monthsToPost,
}: {
  id: number;
  selectedJobBoards: JobBoard[];
  monthsToPost: number;
}) {
  await removeJobBoardPostings(id);
  await createJobBoardPostings({ id, selectedJobBoards });
  const expiryDate = new Date();
  expiryDate.setMonth(new Date().getMonth() + Math.max(12, monthsToPost));
  await db
    .update(jobPosting)
    .set({ expiresAt: expiryDate })
    .where(eq(jobPosting.id, id));
}

export async function updateJobPost(formData: EditJobPosting, postId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      redirect("/sign-in");
    }

    const postData = {
      ...formData,
      userId: session.user.id,
      vacancies: !formData.vacancies
        ? null
        : Math.ceil(Number(formData.vacancies)),
      minWorkHours: String(formData.minWorkHours),
      maxWorkHours: !formData.maxWorkHours
        ? null
        : String(formData.maxWorkHours),
      minPayValue: String(formData.minPayValue),
      maxPayValue: !formData.maxPayValue ? null : String(formData.maxPayValue),
    };

    await db
      .update(jobPosting)
      .set(postData)
      .where(
        and(eq(jobPosting.id, postId), eq(jobPosting.userId, session.user.id))
      );
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(id: number) {
  await removeJobBoardPostings(id);
  await db.delete(jobPosting).where(eq(jobPosting.id, id));
}
