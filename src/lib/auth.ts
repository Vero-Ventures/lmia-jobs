import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user as databaseUser } from "@/db/schema";
import { eq } from "drizzle-orm";

import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const dbUser = await db
        .select()
        .from(databaseUser)
        .where(eq(databaseUser.email, user.email))
        .then((res) => res[0]);

      await resend.emails.send({
        from: `Opportunities <${process.env.RESEND_ADDRESS}>`,
        to: [user.email],
        subject: "Reset Your Opportunities Password",
        html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Opportunities Password Reset Request</title>
  </head>
  <body style="background-color: #f9f9f9; padding: 20px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
    <div style="max-width: 600px;  margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="margin-bottom: 20px; ">
        <h1 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 10px; text-align: center;">Password Reset Request</h1>
        <p style="text-align: center;">We received a request to reset your password. You can reset your password by clicking the button below and using the reset code ${dbUser.resetCode}:</p>
        <div style="margin: auto; width: fit-content;">
            <a href="{${url}}" style="align-self: center; display: inline-block; background-color: #3498db; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; margin-bottom: 10px; ">Reset Password</a>
        </div>
        <p style="text-align: center;">If you did not request a password reset, please ignore this email.</p>
        <p style="text-align: center;">
          Thank you, The Opportunities Team
        </p>
      </div>
    </div>
  </body>
</html>
`,
      });
    },
  },
});
