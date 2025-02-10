import { checkInactiveUserAges } from "@/actions/check-users";
import { mailInvitesAndReminders } from "@/actions/mailer";

export async function GET() {
  await checkInactiveUserAges();
  await mailInvitesAndReminders();

  return new Response("Completed", { status: 200 });
}
