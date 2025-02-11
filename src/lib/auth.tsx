import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";

import { Resend } from "resend";

import SignInEmail from "@/components/emails/sign-in-email";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign-in.
          await resend.emails.send({
            from: "Manage Opportunities <no-reply@manageopportunities.ca>",
            to: [email],
            subject: "Sign in to Manage Opportunities",
            react: <SignInEmail otp={otp} />,
          });
        }
      },
    }),
  ],
});
