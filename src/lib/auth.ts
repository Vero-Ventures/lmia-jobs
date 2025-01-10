import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const auth = betterAuth({
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Opportunities <no-reply@manageopportunities.ca>",
        to: [user.email],
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Opportunities <no-reply@manageopportunities.ca>",
        to: [user.email],
        subject: "Reset Your Opportunities Password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
});
