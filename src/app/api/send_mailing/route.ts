import { checkForInactiveUsers } from "@/actions/check-users";
// import { mailInvite } from "@/actions/mailer";

// Cron job to check for inactive users and send out an invite.
// Set to run hourly.
export async function GET() {
  await checkForInactiveUsers();
  // await mailInvite();

  return new Response("Completed", { status: 200 });
}
