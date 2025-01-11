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

interface JobPostingFilters {
  postAsylum: boolean;
  postDisabled: boolean;
  postIndigenous: boolean;
  postNewcomers: boolean;
  postYouth: boolean;
}

function filterPostingsByBoard(
  postings: JobPostingFilters[],
  jobBoard: string
) {
  if (jobBoard === "asylum") {
    postings = postings!.filter(
      (posting: { postAsylum: boolean }) => posting.postAsylum
    );
  }
  if (jobBoard === "disabled") {
    postings = postings!.filter(
      (posting: { postDisabled: boolean }) => posting.postDisabled
    );
  }
  if (jobBoard === "indigenous") {
    postings = postings!.filter(
      (posting: { postIndigenous: boolean }) => posting.postIndigenous
    );
  }
  if (jobBoard === "newcomers") {
    postings = postings!.filter(
      (posting: { postNewcomers: boolean }) => posting.postNewcomers
    );
  }
  if (jobBoard === "youth") {
    postings = postings!.filter(
      (posting: { postYouth: boolean }) => posting.postYouth
    );
  }
  return postings;
}
