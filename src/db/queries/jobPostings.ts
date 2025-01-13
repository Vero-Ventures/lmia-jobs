import { and, eq } from "drizzle-orm";
import { db } from "..";
import { jobPostings } from "../schema";

export async function selectAllJobPostings({
  location,
  jobType,
  query,
  email,
  jobBoard,
}: {
  jobType?: string;
  location?: string;
  query?: string;
  email?: string;
  jobBoard?: string;
}) {
  let postings;
  if (email) {
    postings = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.email, email));
  } else {
    if (location && jobType) {
      postings = await db
        .select()
        .from(jobPostings)
        .where(
          and(
            eq(jobPostings.addressRegion, location),
            eq(jobPostings.employmentType, jobType)
          )
        );
    } else if (location) {
      postings = await db
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.addressRegion, location));
    } else if (jobType) {
      postings = await db
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.employmentType, jobType));
    } else {
      postings = await db.select().from(jobPostings);
    }
  }

  if (query) {
    postings = postings!.filter((posting) =>
      posting.jobTitle.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (jobBoard) {
    postings = filterPostingsByBoard(postings, jobBoard);
  }

  return postings;
}



function filterPostingsByBoard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postings: any[],
  jobBoard: string
) {
  if (jobBoard === "asylum-job-board") {
    postings = postings!.filter(
      (posting: { postAsylum: boolean }) => posting.postAsylum
    );
  }
  if (jobBoard === "disabled-job-board") {
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
