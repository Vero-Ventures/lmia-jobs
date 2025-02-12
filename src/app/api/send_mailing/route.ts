import { checkInactiveUserAges } from "@/actions/check-users";
import { mailInvitesAndReminders } from "@/actions/mailer";

// Cron job to check for inactive users and send invites and reminders.
// Set to run daily at 12:00 AM.
export async function GET() {
  await checkInactiveUserAges();
  await mailInvitesAndReminders();

  return new Response("Completed", { status: 200 });
}
