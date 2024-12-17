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
    .where(eq(mailingList.email, email));

  if (existingEmail) {
    return;
  }

  await Promise.all([
    db.insert(mailingList).values({ email }),
    resend.emails.send({
      from: "LMIA Jobs <no-reply@lmia.veroventures.com>",
      to: [email],
      subject: "You are on LMIA Jobs's early access list",
      react: <WaitListConfirmed />,
    }),
  ]);
}
