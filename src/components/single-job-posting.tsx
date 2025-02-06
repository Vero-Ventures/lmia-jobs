import { DeletePost } from "@/app/[jobBoard]/dashboard/posts/[id]/components/delete-post";
import HidePost from "@/app/[jobBoard]/dashboard/posts/[id]/components/hide-post";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import P from "./paragraph";
import Heading from "./heading";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";
import PayButton from "./pay-button";
import type { JobBoard } from "@/app/lib/constants";

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

  const formatDisplayDate = () => {
    const databaseDate = new Date(jobPosting.startDate);
    databaseDate.setDate(databaseDate.getDate() + 1);
    const localDate = new Date(databaseDate).toDateString().split(" ");
    return localDate[1] + " " + localDate[2] + ", " + localDate[3];
  };

  const formatJobBoards = () => {
    let formattedBoards = "";
    const length = jobBoards.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        formattedBoards +=
          jobBoards[i].charAt(0).toUpperCase() + jobBoards[i].slice(1);

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
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-20">
      {isOwner && isAdmin && (
        <div className="flex justify-end gap-2 px-4">
          {!jobPosting.paymentConfirmed && <PayButton id={jobPosting.id} />}
          <Button asChild>
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

        <P className="mt-2 text-gray-600">
          Posted on{" "}
          {formatDate(jobPosting.createdAt, {
            dateStyle: "medium",
          })}{" "}
          by {jobPosting.orgName}
        </P>
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
          <div className="mt-1 text-start text-sm text-gray-600">
            Expires on:{" "}
            {formatDate(jobPosting.expiresAt, {
              dateStyle: "medium",
            })}
          </div>
          <div className="mt-2 text-center font-semibold text-red-500">
            {currentDate > new Date(jobPosting.expiresAt) ? "Expired" : ""}
          </div>
          <div className="mt-1 text-start text-sm text-gray-600">
            Current Date:{" "}
            {formatDate(currentDate, {
              dateStyle: "medium",
            })}
          </div>
          <div className="mt-2 text-center font-semibold text-red-500">
            {currentDate > new Date(jobPosting.expiresAt) ? "Expired" : ""}
          </div>
        </div>
        <div className="grid gap-6 text-sm md:grid-cols-2">
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
              <P>{jobPosting.language}</P>
            </div>
          )}
          <div className="space-y-2">
            <Heading variant="h3" className="text-primary">
              Job Description
            </Heading>
            <P
              dangerouslySetInnerHTML={{
                __html: jobPosting.description.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <MailIcon className="mr-2 mt-0.5" />
              <h5 className={`mr-4 mt-0.5 text-base font-bold dark:text-white`}>
                Apply by email
              </h5>
              <div className="flex items-center gap-3 text-sm">
                <a
                  href={`mailto:${jobPosting.email}`}
                  className="text-lg text-blue-900 underline">
                  {jobPosting.email}
                </a>
              </div>
            </div>
          </div>

          {isAdmin && jobBoards.length > 0 && (
            <div className="mt-2 flex gap-2">
              Posted To Boards: {formatJobBoards()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
