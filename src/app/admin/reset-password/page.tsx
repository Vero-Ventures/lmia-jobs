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
    <main className="h-dvh content-center px-8">
      <ResetPassword />
    </main>
  );
}
