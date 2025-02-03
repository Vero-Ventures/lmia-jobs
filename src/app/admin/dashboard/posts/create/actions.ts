"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobBoardPosting, jobPosting } from "@/db/schema";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import type {
  CreateJobPosting,
  EditJobPosting,
} from "@/app/lib/job-postings/schema";
import type { JobBoard } from "@/app/lib/constants";

export async function createJobPost(
  formData: CreateJobPosting,
  selectedJobBoards: JobBoard[]
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return redirect("/sign-in");

    const { monthsToPost, ...rest } = formData;

    const expiryDate = new Date();
    expiryDate.setMonth(new Date().getMonth() + Math.max(12, monthsToPost));

    const postData = {
      ...rest,
      userId: session.user.id,
      vacancies: !formData.vacancies
        ? null
        : Math.ceil(Number(formData.vacancies)),
      workHours: !formData.workHours
        ? null
        : Math.ceil(Number(formData.workHours)),
      minPayValue: Math.ceil(Number(formData.minPayValue)),
      maxPayValue: !formData.maxPayValue
        ? null
        : Math.ceil(Number(formData.maxPayValue)),
      expiresAt: expiryDate,
      paymentConfirmed: false,
      hidden: false,
    };

    const { id: jobPostingId } = await db
      .insert(jobPosting)
      .values(postData)
      .returning({ id: jobPosting.id })
      .then((res) => res[0]);

    await createJobBoardPostings({ id: jobPostingId, selectedJobBoards });

    return jobPostingId;
  } catch (error) {
    console.error(error);
  }
}

export async function createJobBoardPostings({
  id,
  selectedJobBoards,
}: {
  id: number;
  selectedJobBoards: JobBoard[];
}) {
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
      workHours: !formData.workHours
        ? null
        : Math.ceil(Number(formData.workHours)),
      minPayValue: Math.ceil(Number(formData.minPayValue)),
      maxPayValue: !formData.maxPayValue
        ? null
        : Math.ceil(Number(formData.maxPayValue)),
    };

    await db
      .update(jobPosting)
      .set(postData)
      .where(
        and(
          eq(jobPosting.id, Number(postId)),
          eq(jobPosting.userId, session.user.id)
        )
      );
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(id: number) {
  await removeJobBoardPostings(id);
  await db.delete(jobPosting).where(eq(jobPosting.id, id));
}
