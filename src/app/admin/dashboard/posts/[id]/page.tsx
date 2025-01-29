import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { selectUserSingleJobPosting } from "@/db/queries/jobPostings";
import { auth } from "@/lib/auth";
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
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HidePost from "./components/hide-post";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: number }>;
}

export default async function SinglePostPage({ params }: PageProps) {
  const currentDate = new Date();
  const { id } = await params;
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/sign-in");
  }
  const jobPosting = await selectUserSingleJobPosting({
    id,
    userId: data.user.id,
  });
  return (
    <div className="container mx-auto py-8">
      <Card className="h-fit overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle
              className={`titleCase text-2xl font-bold dark:text-white`}>
              {jobPosting.title}
            </CardTitle>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/dashboard/posts/${jobPosting.id}/edit`}>
                  <Pencil />
                  <span>Edit</span>
                </Link>
              </Button>
              <HidePost id={jobPosting.id} hidden={jobPosting.hidden} />
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            {jobPosting.orgName}
          </CardDescription>
          <div>
            {jobPosting.hidden && <Badge variant="secondary">Hidden</Badge>}
          </div>
          <div className="ml-auto flex w-fit flex-col">
            <div className="mt-2 text-start text-sm text-gray-500 dark:text-gray-400">
              Opened: {new Date(jobPosting.createdAt).toDateString()}
            </div>
            <div className="mt-2 text-start text-sm text-gray-500 dark:text-gray-400">
              Closes: {new Date(jobPosting.expiresAt).toDateString()}
            </div>
            <div className="mt-2 text-center font-semibold text-red-500">
              {currentDate > new Date(jobPosting.expiresAt) ? "Expired" : ""}
            </div>
          </div>

          <div className="grid gap-6 text-sm md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="size-6 text-gray-500 dark:text-gray-400" />
                <span className="titleCase text-gray-500 dark:text-gray-400">
                  {jobPosting.employmentType
                    ? `${jobPosting.employmentType}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {jobPosting.address && `${jobPosting.address}, `}
                  {jobPosting.city}, {jobPosting.province}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CircleDollarSignIcon className="size-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  ${jobPosting.minPayValue}{" "}
                  {jobPosting.minPayValue
                    ? `to $${jobPosting.maxPayValue}`
                    : ""}{" "}
                  {jobPosting.paymentType}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="size-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {`${jobPosting.workHours ? jobPosting.workHours + " / Week" : "N/A"}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {`${jobPosting.startDate ? "Start By: " + jobPosting.startDate : "N/A"}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User2Icon className="size-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {jobPosting.vacancies
                    ? `${jobPosting.vacancies} ${jobPosting.vacancies > 1 ? "vacancies" : "vacancy"} `
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <div className="pt-4">
          <CardContent className="space-y-4">
            {jobPosting.language && (
              <div className="space-y-2">
                <h5 className={`text-base font-bold dark:text-white`}>
                  Languages
                </h5>
                <p className="text-gray-500 dark:text-gray-400">
                  {jobPosting.language}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <h5 className={`text-base font-bold dark:text-white`}>
                Job Description
              </h5>
              <p
                className="text-gray-500 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: jobPosting.description }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-2">
              <div className="flex">
                <MailIcon className="mr-2 mt-0.5" />
                <h5
                  className={`mr-4 mt-0.5 text-base font-bold dark:text-white`}>
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
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
