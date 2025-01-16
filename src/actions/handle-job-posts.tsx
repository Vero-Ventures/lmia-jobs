"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { JobPosting } from "@/app/lib/types";

type jobPostForm = {
  jobTitle: string;
  hiringOrganization: string;
  employmentType: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress: string | null;
  compTimeUnit: string;
  minCompValue: string | number;
  maxCompValue: string | number | null;
  workHours: string | number | null;
  startTime: string | Date;
  vacancies: string | number | null;
  description: string;
  language: string;
  postAsylum: boolean;
  postDisabled: boolean;
  postIndigenous: boolean;
  postNewcomers: boolean;
  postYouth: boolean;
};

export async function handleJobPost(
  formData: jobPostForm,
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

    formData.startTime = new Date(formData.startTime);

    const datePosted = new Date().toISOString();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.error("session error");
      return "error";
    } else {
      const postData = {
        ...formData,
        streetAddress:
          formData.streetAddress === "" ? null : formData.streetAddress,
        language: formData.language === "" ? null : formData.language,
        maxCompValue:
          formData.maxCompValue === ""
            ? null
            : Math.ceil(Number(formData.maxCompValue)),
        workHours:
          formData.workHours === ""
            ? null
            : Math.ceil(Number(formData.workHours)),
        vacancies:
          formData.vacancies === ""
            ? null
            : Math.ceil(Number(formData.vacancies)),
        minCompValue: Math.ceil(Number(formData.minCompValue)),
        startTime: formData.startTime.toISOString().split("T")[0],
        email: session.user.email,
        datePosted: datePosted,
        validThrough: new Date().toISOString().split("T")[0],
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

export async function deleteJobPost(postId: string): Promise<string> {
  try {
    await db.delete(jobPostings).where(eq(jobPostings.id, Number(postId)));
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
