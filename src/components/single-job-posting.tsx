import { DeletePost } from "@/app/admin/dashboard/posts/[id]/components/delete-post";
import HidePost from "@/app/admin/dashboard/posts/[id]/components/hide-post";
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
import { formatDate, formatMoney } from "@/lib/utils";
import PayButton from "./pay-button";

export default function SingleJobPosting({
  jobPosting,
  isAdmin = false,
  isOwner = false,
}: {
  jobPosting: JobPosting;
  isAdmin?: boolean;
  isOwner?: boolean;
}) {
  const currentDate = new Date();
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
        <div className="flex gap-2">
          {jobPosting.paymentConfirmed ? (
            <Badge variant="success">Paid</Badge>
          ) : (
            <Badge variant="warning">Not Paid</Badge>
          )}
          {jobPosting.hidden && <Badge variant="secondary">Hidden</Badge>}
        </div>
        {isAdmin && isOwner && (
          <div className="flex w-fit flex-col">
            <div className="mt-2 text-start text-sm text-gray-600">
              Expires on:{" "}
              {formatDate(jobPosting.expiresAt, {
                dateStyle: "medium",
              })}
            </div>
            <div className="mt-2 text-center font-semibold text-red-500">
              {currentDate > new Date(jobPosting.expiresAt) ? "Expired" : ""}
            </div>
          </div>
        )}
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
                ${formatMoney(jobPosting.minPayValue)}{" "}
                {jobPosting.maxPayValue
                  ? `to $${formatMoney(jobPosting.maxPayValue)}`
                  : ""}{" "}
                {jobPosting.paymentType === "Hourly" ? "hourly" : "annually"}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-6 text-gray-600" />
              <span className="text-gray-600">
                {`${jobPosting.workHours ? jobPosting.workHours + " Hours / Week" : "N/A"}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-6 text-gray-600" />
              <span className="text-gray-600">
                {`${
                  jobPosting.startDate
                    ? "Start Date: " +
                      formatDate(jobPosting.startDate, {
                        dateStyle: "medium",
                      })
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
            <P dangerouslySetInnerHTML={{ __html: jobPosting.description }} />
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
        </div>
      </div>
    </div>
  );
}
