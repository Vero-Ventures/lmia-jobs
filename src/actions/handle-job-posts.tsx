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

export async function createNewPost(
  chargeId: string,
  numBoards: number,
  numTime: number,
  userEmail: string
): Promise<string> {
  try {
    const expireryDate = new Date();

    expireryDate.setMonth(new Date().getMonth() + numTime);

    const values = {
      stripeChargeId: chargeId,
      jobTitle: "New Post - " + new Date().toISOString().split("T")[0],
      organizationName: "Organization Name",
      region: "Region",
      city: "City",
      address: null,
      startTime: new Date().toISOString().split("T")[0],
      vacancies: null,
      employmentType: "Full Time",
      workHours: null,
      paymentType: "Salary",
      minPayValue: 0,
      maxPayValue: null,
      description: "Description",
      language: "English",
      postAsylum: false,
      postDisabled: false,
      postIndigenous: false,
      postNewcomers: false,
      postYouth: false,
      email: userEmail,
      expiresAt: expireryDate.toISOString().split("T")[0],
      maxBoards: numBoards,
    };

    const existingPost = await db
      .select()
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.email, userEmail),
          eq(jobPostings.stripeChargeId, chargeId)
        )
      )
      .then((res) => res[0]);

    if (!existingPost) {
      await db.insert(jobPostings).values(values);
      return "refresh";
    }

    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}

export async function updateJobPost(
  formData: JobPostForm,
  noBoards: boolean,
  postId: string,
  userEmail: string
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
        hidden: false,
      };

      await db
        .update(jobPostings)
        .set(postData)
        .where(
          and(
            eq(jobPostings.id, Number(postId)),
            eq(jobPostings.email, userEmail)
          )
        );

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
