import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

import { Resend } from "resend";
import ResetPassword from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const auth = betterAuth({
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user }) => {
      await resend.emails.send({
        from: "Opportunities <no-reply@manageopportunities.ca>",
        to: [user.email],
        subject: "Verify your email address",
        react: <VerifyEmail url={"http://localhost:3000/admin/sign-in"} />,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Opportunities <no-reply@manageopportunities.ca>",
        to: [user.email],
        subject: "Reset Your Opportunities Password",
        react: <ResetPassword url={url} />,
      });
    },
  },
});
