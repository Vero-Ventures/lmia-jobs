import { unauthorized } from "next/navigation";
import { ResetPassword } from "./reset-password";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { token, error } = await searchParams;

  if (token === "invalid_token" || error) {
    unauthorized();
  }
  return (
    <div className="h-dvh content-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-8">
      <ResetPassword />
    </div>
  );
}
