"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobPosting } from "@/db/schema";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import type { CreatePost, EditPost } from "@/app/lib/job-postings/schema";

export async function createJobPost(formData: CreatePost) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) return null;

    const { monthsToPost, ...rest } = formData;

    const expiryDate = new Date();
    expiryDate.setMonth(new Date().getMonth() + Math.max(12, monthsToPost));

    const postData = {
      ...rest,
      userId: session.user.id,
      address: formData.address === "" ? null : formData.address,
      region: formData.province,
      startDate: formData.startDate,
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
      language: formData.language,
      expiresAt: expiryDate,
      paymentConfirmed: false,
      hidden: true,
    };

    const jobPostingId = await db
      .insert(jobPostings)
      .values(postData)
      .returning({ id: jobPostings.id })
      .then((res) => res[0]);

    return jobPostingId;
  } catch (error) {
    console.error(error);
  }
}

export async function updateJobPost(formData: EditPost, postId: string) {
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
      address: formData.address === "" ? null : formData.address,
      region: formData.province,
      startDate: formData.startDate,
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
      language: formData.language,
    };

    await db
      .update(jobPostings)
      .set(postData)
      .where(
        and(eq(jobPostings.id, postId), eq(jobPostings.userId, session.user.id))
      );
  } catch (error) {
    console.error(error);
  }
}
