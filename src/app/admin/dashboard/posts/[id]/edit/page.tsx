import { selectUserSingleJobPosting } from "@/db/queries/jobPostings";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { EditPostForm } from "./edit-post-form";

interface PageProps {
  params: Promise<{ id: string }>;
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
    id: +id,
    userId: data.user.id,
  });
  return (
    <div>
      <EditPostForm
        initialValues={{
          email: jobPosting.email,
          title: jobPosting.title,
          orgName: jobPosting.orgName,
          province: jobPosting.province,
          city: jobPosting.city,
          address: jobPosting.address || "",
          startDate: jobPosting.startDate,
          vacancies: jobPosting.vacancies || 0,
          employmentType: jobPosting.employmentType,
          workHours: jobPosting.workHours || 0,
          paymentType: jobPosting.paymentType,
          minPayValue: jobPosting.minPayValue,
          maxPayValue: jobPosting.maxPayValue || 0,
          description: jobPosting.description,
          language: jobPosting.language,
        }}
      />
    </div>
  );
}
