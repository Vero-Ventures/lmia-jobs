"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";

type JobPosting = FunctionReturnType<
  typeof api.jobPostings.listJobPostings
>[number];

export default function JobPostingSection() {
  const jobPostings = useQuery(api.jobPostings.listJobPostings);

  return (
    <section className="relative overflow-y-auto p-4">
      <div>
        {!jobPostings ? (
          <div className="flex items-center justify-center">
            <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-gray-600" />
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="w-4/12 space-y-8">
              {jobPostings.map((jobPosting) => {
                return (
                  <JobListCard key={jobPosting._id} jobPosting={jobPosting} />
                );
              })}
            </div>
            <div className="w-8/12">
              <JobPostingCard jobPostingId={jobPostings[0]._id} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function JobListCard({ jobPosting }: { jobPosting: JobPosting }) {
  return (
    <Card className="cursor-pointer space-y-3">
      <CardHeader>
        <CardTitle className="titleCase text-xl font-bold">
          {jobPosting.jobTitle}
        </CardTitle>
        <CardDescription>{jobPosting.hiringOrganization}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="text-gray-500 dark:text-gray-400">
            {jobPosting.addressLocality}, {jobPosting.addressRegion}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ${`${jobPosting.minCompValue}`}{" "}
            {jobPosting.maxCompValue ? `to $${jobPosting.maxCompValue}` : ""}{" "}
            hourly
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-gray-400">
          {new Date(jobPosting.datePosted).toDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}

import {
  MapPinIcon,
  ClockIcon,
  BriefcaseIcon,
  CircleDollarSignIcon,
  CalendarIcon,
  User2Icon,
  MailIcon,
} from "lucide-react";

function JobPostingCard({ jobPostingId }: { jobPostingId: Id<"jobPostings"> }) {
  const jobPosting = useQuery(api.jobPostings.getSingleJobPosting, {
    jobPostingId,
  });
  if (!jobPosting) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className={`titleCase text-2xl font-bold dark:text-white`}>
            {jobPosting.jobTitle}
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {jobPosting.hiringOrganization}
          </CardDescription>
          <div className="mt-1 text-right text-sm text-gray-500 dark:text-gray-400 lg:mt-0">
            {new Date(jobPosting.datePosted).toDateString()}
          </div>
        </div>
        <div className="grid gap-6 text-sm md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="titleCase text-gray-500 dark:text-gray-400">
                {jobPosting.employmentSubType
                  ? jobPosting.employmentSubType
                  : ""}
                {jobPosting.employmentType
                  ? `, ${jobPosting.employmentType}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {jobPosting.streetAddress && `${jobPosting.streetAddress}, `}
                {jobPosting.addressLocality}, {jobPosting.addressRegion}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CircleDollarSignIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                ${jobPosting.minCompValue}{" "}
                {jobPosting.maxCompValue
                  ? `to $${jobPosting.maxCompValue}`
                  : ""}{" "}
                hourly
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {`${jobPosting.workHours ?? "N/A"}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {`${jobPosting.startTime ?? "N/A"}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User2Icon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {jobPosting.vacancies
                  ? `${jobPosting.vacancies} vacancy`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <CardContent>
          <h5 className={`text-base font-bold dark:text-white`}>
            Job Description
          </h5>
          <p
            className="text-gray-500 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: jobPosting.description }}
          />
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <MailIcon />
            <h5 className={`text-base font-bold dark:text-white`}>
              Apply by email
            </h5>
            <div className="flex items-center gap-3 text-sm">
              <a
                href={`mailto:${jobPosting.email}`}
                className="text-blue-900 underline"
              >
                {jobPosting.email}
              </a>
            </div>
          </div>
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
