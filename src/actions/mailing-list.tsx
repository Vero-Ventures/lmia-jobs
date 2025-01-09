"use server";

import { db } from "@/db";
import { mailingList } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import WaitListConfirmed from "@/components/emails/waitlist-confirmed";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function joinMailingList({ email }: { email: string }) {
  const existingEmail = await db
    .select()
    .from(mailingList)
    .where(eq(mailingList.email, email))
    .then((res) => res[0]);

  if (existingEmail) {
    throw new Error("You're already on the waiting list.");
  }

  await Promise.all([
    db.insert(mailingList).values({ email }),
    resend.emails.send({
      from: `Opportunities ${process.env.RESEND_ADDRESS}`,
      to: [email],
      subject: "You are on LMIA Jobs's early access list",
      react: <WaitListConfirmed />,
    }),
  ]);
}
