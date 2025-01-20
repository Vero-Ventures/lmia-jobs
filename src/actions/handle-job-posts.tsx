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

export async function updateJobPost(
  formData: JobPostForm,
  noBoards: boolean,
  postId: string | null,
  userEmail: string | null
): Promise<string> {
  try {
    if (
      !formData.postAsylum &&
      !formData.postDisabled &&
      !formData.postIndigenous &&
      !formData.postNewcomers &&
      !formData.postYouth &&
      !noBoards
    ) {
      return "no boards";
    }

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
        email: session.user.email,
        expiresAt: new Date().toISOString().split("T")[0],
      };

      if (postId && userEmail) {
        await db
          .update(jobPostings)
          .set(postData)
          .where(
            and(
              eq(jobPostings.id, Number(postId)),
              eq(jobPostings.email, userEmail)
            )
          );
      } else {
        await db.insert(jobPostings).values(postData);
      }

      return "success";
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
      .where(
        and(eq(jobPostings.id, Number(postId)), eq(jobPostings.email, email))
      )
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

export async function changePostVisibility(postId: string): Promise<string> {
  try {
    await db
      .update(jobPostings)
      .set({ hidden: !jobPostings.hidden })
      .where(eq(jobPostings.id, Number(postId)));
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
