"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobPosting } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { JobPosting } from "@/app/lib/types";
import { revalidatePath } from "next/cache";
import type {
  EmploymentType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";

export type JobPostForm = {
  email: string;
  title: string;
  orgName: string;
  province: string;
  city: string;
  address: string | null;
  startDate: string;
  vacancies: string | null;
  employmentType: string;
  workHours: string | null;
  paymentType: string;
  minPayValue: string;
  maxPayValue: string | null;
  description: string;
  language: string;
};

export async function createJobPost(
  formData: JobPostForm,
  userId: string,
  postTime: number
): Promise<[string, number, number | null]> {
  try {
    const expireryDate = new Date();

    expireryDate.setMonth(new Date().getMonth() + postTime);

    const postData = {
      ...formData,
      userId: userId,
      language: formData.language as Language,
      province: formData.province as Province,
      employmentType: formData.employmentType as EmploymentType,
      paymentType: formData.paymentType as PaymentType,
      startDate: new Date(formData.startDate),
      minPayValue: Math.ceil(Number(formData.minPayValue)),
      maxPayValue:
        formData.maxPayValue === ""
          ? null
          : Math.ceil(Number(formData.maxPayValue)),
      vacancies:
        formData.vacancies === ""
          ? null
          : Math.ceil(Number(formData.vacancies)),
      workHours:
        formData.workHours === ""
          ? null
          : Math.ceil(Number(formData.workHours)),
      hidden: true,
      paymentConfirmed: false,
      expiresAt: expireryDate,
    };

    const result = await db
      .insert(jobPosting)
      .values(postData)
      .returning()
      .then((res) => res[0]);

    return ["created", 0, result.id];
  } catch (error) {
    console.error(error);
    return ["error", 0, null];
  }
}

export async function updateJobPost(
  formData: JobPostForm,
  postId: number,
  userId: string
): Promise<string> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.error("session error");
      return "error";
    } else {
      const postData = {
        ...formData,
        language: formData.language as Language,
        province: formData.province as Province,
        employmentType: formData.employmentType as EmploymentType,
        paymentType: formData.paymentType as PaymentType,
        startDate: new Date(formData.startDate),
        minPayValue: Math.ceil(Number(formData.minPayValue)),
        maxPayValue:
          formData.maxPayValue === ""
            ? null
            : Math.ceil(Number(formData.maxPayValue)),
        vacancies:
          formData.vacancies === ""
            ? null
            : Math.ceil(Number(formData.vacancies)),
        workHours:
          formData.workHours === ""
            ? null
            : Math.ceil(Number(formData.workHours)),
      };

      await db
        .update(jobPosting)
        .set(postData)
        .where(and(eq(jobPosting.id, postId), eq(jobPosting.userId, userId)));

      return "updated";
    }
  } catch (error) {
    console.error(error);
    return "error";
  }
}

export async function getJobPost(
  postId: number,
  userId: string
): Promise<[boolean, JobPosting | null]> {
  try {
    const result = await db
      .select()
      .from(jobPosting)
      .where(and(eq(jobPosting.id, postId), eq(jobPosting.userId, userId)))
      .then((res) => res[0]);

    if (result) {
      return [true, result];
    } else {
      return [false, null];
    }
  } catch (error) {
    console.error(error);
    return [false, null];
  }
}

export async function editPostVisibility(
  id: number,
  hidePost: boolean
): Promise<string> {
  try {
    await db
      .update(jobPosting)
      .set({ hidden: hidePost })
      .where(eq(jobPosting.id, id));
    revalidatePath(`/dashboard/posts/${jobPosting.id}`);
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
