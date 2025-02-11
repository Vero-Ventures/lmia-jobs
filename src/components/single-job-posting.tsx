"use client";

import type { JobPosting } from "@/db/schema";
import {
  BriefcaseIcon,
  CalendarIcon,
  CircleDollarSignIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  Pencil,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import Heading from "@/components/ui/html/heading";
import Paragraph from "@/components/ui/html/paragraph";
import PayButton from "@/components/pay-dialogue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";
import type { JobBoard } from "@/app/lib/constants";
import { DeletePost } from "@/app/[jobBoard]/dashboard/posts/[id]/components/delete-post";
import HidePost from "@/app/[jobBoard]/dashboard/posts/[id]/components/hide-post";

// Takes: A Job Posting Enum value, an array of Job Board values, and two boolean values.
export default function SingleJobPosting({
  jobPosting,
  jobBoards = [],
  isAdmin = false,
  isOwner = false,
}: {
  jobPosting: JobPosting;
  jobBoards?: JobBoard[];
  isAdmin?: boolean;
  isOwner?: boolean;
}) {
  const currentDate = new Date();

  // Takes a database date and converts it to format: Abbr. Month Day, Year
  const formatDisplayDate = () => {
    const databaseDate = new Date(jobPosting.startDate);
    databaseDate.setDate(databaseDate.getDate() + 1);
    const localDate = new Date(databaseDate).toDateString().split(" ");
    return localDate[1] + " " + localDate[2] + ", " + localDate[3];
  };

  // Takes an array of Job Board values and formats them for display.
  // Capitalizes each job board, adds comma's and an ending period.
  const formatJobBoards = () => {
    // Remove the "all" value from the array, then sort by alphabetical order.
    let formattedBoards = "All, ";
    const sortedBoards = jobBoards.filter((board) => board !== "all").sort();

    // If there are any other job boards, iterate over them and format them for display.
    const length = sortedBoards.length;
    if (length > 0) {
      console.log(jobBoards);
      for (let i = 0; i < length; i++) {
        formattedBoards +=
          sortedBoards[i].charAt(0).toUpperCase() + sortedBoards[i].slice(1);

        if (i < length - 1) {
          formattedBoards += ", ";
        } else {
          formattedBoards += ".";
        }
      }
    }
    return formattedBoards;
  };

  return (
    <div className="mx-auto my-12 w-11/12 max-w-4xl space-y-8 justify-self-center rounded-lg border-2 border-gray-300 p-4 md:w-fit md:p-6">
      {isOwner && isAdmin && (
        <div className="mx-auto grid grid-cols-2 grid-rows-2 justify-evenly gap-4 mb:flex mb:gap-0">
          {!jobPosting.paymentConfirmed && <PayButton id={jobPosting.id} />}
          <Button className="min-w-24" asChild>
            <Link href={`/dashboard/posts/${jobPosting.id}/edit`}>
              <Pencil />
              <span>Edit</span>
            </Link>
          </Button>
          <HidePost id={jobPosting.id} hidden={jobPosting.hidden} />
          <DeletePost id={jobPosting.id} />
        </div>
      )}
      <div className="space-y-4">
        <Heading className={`titleCase text-primary`}>
          {jobPosting.title}
        </Heading>

        <Paragraph className="text-gray-600">
          Posted on{" "}
          {formatDate(jobPosting.createdAt, {
            dateStyle: "medium",
          })}{" "}
          by {jobPosting.orgName}
        </Paragraph>
        {isAdmin && (
          <div className="flex gap-2">
            {jobPosting.paymentConfirmed ? (
              <Badge variant="success">Paid</Badge>
            ) : (
              <Badge variant="warning">Not Paid</Badge>
            )}
            {jobPosting.hidden && <Badge variant="secondary">Hidden</Badge>}
          </div>
        )}
        <div className="flex w-fit flex-col">
          <div className="mt-1 text-start text-sm italic text-gray-600">
            Expires on:{" "}
            {formatDate(jobPosting.expiresAt, {
              dateStyle: "medium",
            })}
            {currentDate > new Date(jobPosting.expiresAt) ? (
              <Badge variant="destructive" className="ml-4">
                Expired
              </Badge>
            ) : (
              ""
            )}
          </div>
          <div className="mb-2 mt-2 text-start text-sm italic text-gray-600">
            Current Date:{" "}
            {formatDate(currentDate, {
              dateStyle: "medium",
            })}
          </div>
        </div>
        <div className="grid gap-6 rounded-lg border-2 border-gray-300 p-4 text-sm md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="size-6 text-gray-600" />
              <span className="titleCase text-gray-600">
                {jobPosting.employmentType
                  ? `${jobPosting.employmentType}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-6 text-gray-600" />
              <span className="text-gray-600">
                {jobPosting.address && `${jobPosting.address}, `}
                {jobPosting.city}, {jobPosting.province}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CircleDollarSignIcon className="size-6 text-gray-600" />
              <span className="text-gray-600">
                ${formatMoney(Number(jobPosting.minPayValue))}{" "}
                {jobPosting.maxPayValue
                  ? `to $${formatMoney(Number(jobPosting.maxPayValue))}`
                  : ""}{" "}
                {jobPosting.paymentType === "Hourly" ? "hourly" : "annually"}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-6 text-gray-600" />
              <span className="text-gray-600">
                {jobPosting.minWorkHours
                  ? formatTime(Number(jobPosting.minWorkHours))
                  : ""}
                {jobPosting.maxWorkHours
                  ? ` to ${formatTime(Number(jobPosting.maxWorkHours))}`
                  : ""}
                {` Hours / Week`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-6 text-gray-600" />
              <span className="text-gray-600">
                {`${
                  jobPosting.startDate
                    ? "Start Date: " + formatDisplayDate()
                    : "N/A"
                }`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User2Icon className="size-6 text-gray-600" />
              <span className="text-gray-600">
                {jobPosting.vacancies
                  ? `${jobPosting.vacancies} ${jobPosting.vacancies > 1 ? "vacancies" : "vacancy"} `
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="space-y-4">
          {jobPosting.language && (
            <div className="space-y-2">
              <Heading variant="h3" className="text-primary">
                Languages
              </Heading>
              <Paragraph>{jobPosting.language}</Paragraph>
            </div>
          )}
          <div className="space-y-2">
            <Heading variant="h3" className="">
              Job Description
            </Heading>
            <Paragraph
              className="w-fit rounded-lg border-2 border-gray-300 p-4 text-primary"
              dangerouslySetInnerHTML={{
                __html: jobPosting.description.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex w-fit flex-col sm:flex-row">
              <div className="flex">
                <MailIcon className="mr-2 mt-0.5" />
                <h5
                  className={`mr-4 mt-0.5 w-[120px] text-base font-bold dark:text-white`}>
                  Apply by email
                </h5>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm mb:mt-0">
                <a
                  href={`mailto:${jobPosting.email}`}
                  className="text-lg text-blue-900 underline">
                  {jobPosting.email}
                </a>
              </div>
            </div>
          </div>
          <hr className="mt-4" />
          {isAdmin && jobBoards.length > 0 && (
            <div className="mt-2 flex gap-2 text-center">
              Posted To Boards:{" "}
              <span className="font-semibold">{formatJobBoards()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
