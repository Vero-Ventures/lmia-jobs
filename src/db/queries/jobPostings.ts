import { db } from "..";
import { jobPostings } from "@/db/schema";
import type { JobPosting } from "@/app/lib/types";

export async function selectAllJobPostings({
  jobBoard,
  email,
  jobTitle,
  location,
  jobType,
}: {
  jobBoard?: string;
  email?: string;
  jobTitle?: string;
  jobType?: string;
  location?: string;
}) {
  let postings = await db.select().from(jobPostings);

  if (email) {
    postings = postings!.filter(
      (posting: { email: string }) => posting.email === email
    );
  } else {
    if (location) {
      postings = postings!.filter(
        (posting: { region: string }) => posting.region === location
      );
    }
    if (jobType) {
      postings = postings!.filter(
        (posting: { employmentType: string }) =>
          posting.employmentType === jobType
      );
    }
    if (jobBoard) {
      postings = filterPostingsByBoard(postings, jobBoard);
    }

    postings = postings!.filter(
      (posting: { paymentConfirmed: boolean }) => posting.paymentConfirmed
    );

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    postings = postings!.filter(
      (posting: { expiresAt: string }) =>
        new Date(posting.expiresAt) > currentDate
    );
  }

  if (jobTitle) {
    postings = postings!.filter((posting) =>
      posting.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())
    );
  }

  return postings;
}

function filterPostingsByBoard(postings: JobPosting[], jobBoard: string) {
  if (jobBoard === "asylum-job-board") {
    postings = postings!.filter(
      (posting: { postAsylum: boolean }) => posting.postAsylum
    );
  }
  if (jobBoard === "accessible-job-board") {
    postings = postings!.filter(
      (posting: { postDisabled: boolean }) => posting.postDisabled
    );
  }
  if (jobBoard === "indigenous-job-board") {
    postings = postings!.filter(
      (posting: { postIndigenous: boolean }) => posting.postIndigenous
    );
  }
  if (jobBoard === "newcomers-job-board") {
    postings = postings!.filter(
      (posting: { postNewcomers: boolean }) => posting.postNewcomers
    );
  }
  if (jobBoard === "youth-job-board") {
    postings = postings!.filter(
      (posting: { postYouth: boolean }) => posting.postYouth
    );
  }
  return postings;
}
