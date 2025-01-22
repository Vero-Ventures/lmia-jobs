"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { JobPosting } from "@/app/lib/types";

export type JobPostForm = {
  jobTitle: string;
  organizationName: string;
  region: string;
  city: string;
  address: string | null;
  startTime: string;
  vacancies: string | null;
  employmentType: string;
  workHours: string | null;
  paymentType: string;
  minPayValue: string;
  maxPayValue: string | null;
  description: string;
  language: string;
  postAsylum: boolean;
  postDisabled: boolean;
  postIndigenous: boolean;
  postNewcomers: boolean;
  postYouth: boolean;
};

export async function createJobPost(
  formData: JobPostForm,
  postTime: number,
  userEmail: string
): Promise<[string, number, string | null]> {
  try {
    let numBoards = 0;

    const boards = [
      formData.postAsylum,
      formData.postDisabled,
      formData.postIndigenous,
      formData.postNewcomers,
      formData.postYouth,
    ];

    for (const board of boards) {
      if (board) {
        numBoards += 1;
      }
    }

    const expireryDate = new Date();

    expireryDate.setMonth(new Date().getMonth() + postTime);

    const postData = {
      ...formData,
      address: formData.address === "" ? null : formData.address,
      startTime: formData.startTime,
      vacancies:
        formData.vacancies === ""
          ? null
          : Math.ceil(Number(formData.vacancies)),
      workHours:
        formData.workHours === ""
          ? null
          : Math.ceil(Number(formData.workHours)),
      minPayValue: Math.ceil(Number(formData.minPayValue)),
      maxPayValue:
        formData.maxPayValue === ""
          ? null
          : Math.ceil(Number(formData.maxPayValue)),
      language: formData.language === "" ? null : formData.language,
      email: userEmail,
      expiresAt: expireryDate.toISOString().split("T")[0],
      paymentConfirmed: false,
    };

    const result = await db
      .insert(jobPostings)
      .values(postData)
      .returning()
      .then((res) => res[0]);

    return ["created", numBoards, result.id];
  } catch (error) {
    console.error(error);
    return ["error", 0, null];
  }
}

export async function updateJobPost(
  formData: JobPostForm,
  postId: string,
  userEmail: string
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
        address: formData.address === "" ? null : formData.address,
        startTime: formData.startTime,
        vacancies:
          formData.vacancies === ""
            ? null
            : Math.ceil(Number(formData.vacancies)),
        workHours:
          formData.workHours === ""
            ? null
            : Math.ceil(Number(formData.workHours)),
        minPayValue: Math.ceil(Number(formData.minPayValue)),
        maxPayValue:
          formData.maxPayValue === ""
            ? null
            : Math.ceil(Number(formData.maxPayValue)),
        language: formData.language === "" ? null : formData.language,
      };

      await db
        .update(jobPostings)
        .set(postData)
        .where(
          and(eq(jobPostings.id, postId), eq(jobPostings.email, userEmail))
        );

      return "updated";
    }
  } catch (error) {
    console.error(error);
    return "error";
  }
}

export async function getJobPost(
  postId: string,
  email: string
): Promise<[boolean, JobPosting | null]> {
  try {
    const result = await db
      .select()
      .from(jobPostings)
      .where(and(eq(jobPostings.id, postId), eq(jobPostings.email, email)))
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
