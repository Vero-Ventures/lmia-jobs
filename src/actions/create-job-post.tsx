"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobPostings } from "@/db/schema";

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

export async function createJobPost(
  formData: jobPostForm,
  noBoards: boolean
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
      console.log("session error");
      return "error";
    } else {
      const postData = {
        ...formData,
        minCompValue: Math.ceil(Number(formData.minCompValue)),
        maxCompValue: Math.ceil(Number(formData.maxCompValue)),
        workHours: Math.ceil(Number(formData.workHours)),
        vacancies: Math.ceil(Number(formData.vacancies)),
        startTime: formData.startTime.toISOString().split("T")[0],
        email: session.user.email,
        datePosted: datePosted,
        validThrough: new Date().toISOString().split("T")[0],
      };

      console.log(postData);

      await db.insert(jobPostings).values(postData);

      return "success";
    }
  } catch (error) {
    console.log(error);
    return "error";
  }
}
