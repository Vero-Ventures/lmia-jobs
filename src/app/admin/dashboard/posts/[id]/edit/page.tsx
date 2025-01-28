import { selectUserSingleJobPosting } from "@/db/queries/jobPostings";
import { JobPostForm } from "../../job-post-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type {
  JobType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPost({ params }: PageProps) {
  const { id } = await params;
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/admin");
  }
  const jobPosting = await selectUserSingleJobPosting({
    id,
    userId: data.user.id,
  });
  return (
    <div>
      <JobPostForm
        mode="Edit"
        initialValues={{
          email: jobPosting.email,
          jobTitle: jobPosting.jobTitle,
          organizationName: jobPosting.organizationName,
          province: jobPosting.region as Province,
          city: jobPosting.city,
          address: jobPosting.address || "",
          startDate: jobPosting.startDate,
          vacancies: jobPosting.vacancies || 0,
          employmentType: jobPosting.employmentType as JobType,
          workHours: jobPosting.workHours || 0,
          paymentType: jobPosting.paymentType as PaymentType,
          minPayValue: jobPosting.minPayValue,
          maxPayValue: jobPosting.maxPayValue || 0,
          description: jobPosting.description,
          language: jobPosting.language as Language,
          postAsylum: jobPosting.postAsylum,
          postDisabled: jobPosting.postDisabled,
          postIndigenous: jobPosting.postIndigenous,
          postNewcomers: jobPosting.postNewcomers,
          postYouth: jobPosting.postYouth,
          monthsToPost: 1,
        }}
      />
    </div>
  );
}
