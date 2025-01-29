import { selectUserSingleJobPosting } from "@/db/queries/jobPostings";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type {
  EmploymentType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";
import { EditPostForm } from "./edit-post-form";

interface PageProps {
  params: Promise<{ id: number }>;
}

export default async function EditPost({ params }: PageProps) {
  const { id } = await params;
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/");
  }
  const jobPosting = await selectUserSingleJobPosting({
    id,
    userId: data.user.id,
  });
  return (
    <div>
      <EditPostForm
        initialValues={{
          id: String(jobPosting.id),
          email: jobPosting.email,
          jobTitle: jobPosting.title,
          organizationName: jobPosting.orgName,
          province: jobPosting.province as Province,
          city: jobPosting.city,
          address: jobPosting.address || "",
          startDate: jobPosting.startDate ? jobPosting.startDate : "",
          vacancies: jobPosting.vacancies || 0,
          employmentType: jobPosting.employmentType as EmploymentType,
          workHours: jobPosting.workHours || 0,
          paymentType: jobPosting.paymentType as PaymentType,
          minPayValue: jobPosting.minPayValue,
          maxPayValue: jobPosting.maxPayValue || 0,
          description: jobPosting.description,
          language: jobPosting.language as Language,
        }}
      />
    </div>
  );
}
