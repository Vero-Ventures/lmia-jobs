"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { CreatePost } from "./create-post-form";
import { db } from "@/db";
import { jobPostings } from "@/db/schema";

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
