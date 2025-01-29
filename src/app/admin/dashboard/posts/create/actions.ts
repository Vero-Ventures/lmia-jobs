"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobPosting } from "@/db/schema";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import type { CreatePost, EditPost } from "@/app/lib/job-postings/schema";
import type {
  EmploymentType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";

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
      title: formData.jobTitle,
      orgName: formData.organizationName,
      language: formData.language as Language,
      province: formData.province as Province,
      employmentType: formData.employmentType as EmploymentType,
      paymentType: formData.paymentType as PaymentType,
      expiresAt: expiryDate,
      paymentConfirmed: false,
      hidden: true,
    };

    const jobPostingId = await db
      .insert(jobPosting)
      .values(postData)
      .returning({ id: jobPosting.id })
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
      id: Number(formData.id),
      title: formData.jobTitle,
      orgName: formData.organizationName,
      language: formData.language as Language,
      province: formData.province as Province,
      employmentType: formData.employmentType as EmploymentType,
      paymentType: formData.paymentType as PaymentType,
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
