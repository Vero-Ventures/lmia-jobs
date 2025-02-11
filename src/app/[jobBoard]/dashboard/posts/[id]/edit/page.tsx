import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { selectUserSingleJobPosting } from "@/db/queries/jobPostings";
import { EditPostForm } from "@/app/[jobBoard]/dashboard/posts/[id]/edit/edit-post-form";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/");
  }

  const { id } = await params;

  // Get the job posting using the Id.
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
          minWorkHours: Number(jobPosting.minWorkHours) || 0,
          maxWorkHours: Number(jobPosting.maxWorkHours) || 0,
          paymentType: jobPosting.paymentType,
          minPayValue: Number(jobPosting.minPayValue),
          maxPayValue: Number(jobPosting.maxPayValue) || 0,
          description: jobPosting.description,
          language: jobPosting.language,
        }}
      />
    </div>
  );
}
